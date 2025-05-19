import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

import warnings
warnings.filterwarnings("ignore")

# Veriyi yükleme
data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")

# Veri ön işleme
data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',', '.').astype(float)
data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',', '.').astype(float)

data = data.drop(columns=["SCHOOL_CAPACITY", "SCHOOL_ENROLLMENT"])
data = data[data["GENERAL_ENROLLMENT"] != -6]
data = data[data["GENERAL_ENROLLMENT"] != -1]
data = data[data["LAST_SCORE"] != -2]
data = data[data["LAST_SCORE"] != -1]

data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

data=data.drop(columns=["GENERAL_CAPACITY","GENERAL_ENROLLMENT"],axis=1) #General capacity ve enrollment sum değerleriyle aynı olduğu için kaldırdık

data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / \
                                   data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
    
# Skor 
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
data['SCORE_RANGE_RATIO'] = data['SCORE_DIFFERENCE'] / data['FIRST_SCORE']
data['SCORE_STABILITY'] = data.groupby('DEPARTMENT_ID')['SCORE_DIFFERENCE'].transform('std')
    
# Rank
data['RANK_RANGE'] = data['LAST_RANK'] - data['FIRST_RANK']
data['RANK_RANGE_RATIO'] = data['RANK_RANGE'] / data['FIRST_RANK']
data['RANK_STABILITY'] = data.groupby('DEPARTMENT_ID')['RANK_RANGE'].transform('std')

data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)
    
# Field rate 
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
data['FIELD_RATE_STABILITY'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('std')
data['FIELD_RATE_TREND'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform(lambda x: x.pct_change().mean())
        
# Year-over-year changes
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
    
# University-level metrics
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
data['UNIVERSITY_SCORE_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_SCORE'].transform('mean')
data['UNIVERSITY_RANK_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_RANK'].transform('mean')
    
# Department-specific trends
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change()
data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()
    
# Rolling metrics (3-year window)
data['ROLLING_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
data['ROLLING_SCORE_DIFF'] = data.groupby('DEPARTMENT_ID')['SCORE_DIFFERENCE'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
data['ROLLING_RANK_RANGE'] = data.groupby('DEPARTMENT_ID')['RANK_RANGE'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    
# Efficiency metrics
data['ENROLLMENT_EFFICIENCY'] = data['SUM_ENROLLMENT'] / data['SUM_CAPACITY']
data['SCORE_EFFICIENCY'] = data['FIRST_SCORE'] / data['LAST_RANK']
data['RANK_EFFICIENCY'] = data['FIRST_RANK'] / data['LAST_RANK']
    
# Trend indicators
data['SCORE_TREND'] = data.groupby('DEPARTMENT_ID')['FIRST_SCORE'].transform(lambda x: x.pct_change().rolling(window=3, min_periods=1).mean())
data['RANK_TREND'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].transform(lambda x: x.pct_change().rolling(window=3, min_periods=1).mean())

# NaN değerleri temizle
data = data.dropna()

# Az veriye sahip bölümleri çıkar
dept_year_counts = data.groupby("DEPARTMENT_ID")["YEAR_ID"].nunique()
low_departments = dept_year_counts[dept_year_counts <= 2].index
data = data[~data["DEPARTMENT_ID"].isin(low_departments)]

data_25=data.copy()

drop_columns = ["YEAR_ID","UNIVERSITY_ID", "FACULTY_NAME", 
                "DEPARTMENT_NAME", "SCHOLARSHIP_TYPE_ID", "SCORE_TYPE_ID","DEPARTMENT_ID"]
data = data.drop(columns=drop_columns, errors="ignore")

data_25=data_25.drop(columns=['UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID"])

valid_departments = data_25[data_25['YEAR_ID'].isin([24, 23])].groupby('DEPARTMENT_ID')['YEAR_ID'].nunique()
valid_departments = valid_departments[valid_departments == 2].index  # Tüm yılları içerenleri al

# Yalnızca geçerli departmanları filtrele
filtered_df = data_25[data_25['DEPARTMENT_ID'].isin(valid_departments)]

# Ortalamaları hesapla
data_25 = filtered_df.groupby('DEPARTMENT_ID').mean(numeric_only=True).drop(columns=['YEAR_ID'])
print(data_25)

lastTable = pd.DataFrame()



# XGBoost parametreleri
def get_xgb_params(rank_type):
    params = {
        "LAST_RANK": {
            "colsample_bytree": 0.8,  
            "learning_rate": 0.031,
            "max_depth": 5,
            "n_estimators": 700,
            "subsample": 1,
            "random_state": 53,
            "reg_alpha": 0.5,
            "reg_lambda": 0.88,
        },
        "FIRST_RANK": {
            "colsample_bytree": 0.9,
            "learning_rate": 0.031,
            "max_depth": 7,
            "n_estimators": 900,
            "subsample": 0.8,
            "random_state": 27,
            "reg_alpha": 0.55,
            "reg_lambda": 0.22,
        },
    }
    return params[rank_type]

# Model eğitimi ve tahmin
def train_and_predict(data, data_25, rank_type,lastTable):
    X = data.drop(columns=[rank_type])  
    y = data[rank_type]  
    params = get_xgb_params(rank_type)  
    random_state = params["random_state"]

    # Veriyi bölme
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)
    
    # Ölçeklendirme
    scaler = StandardScaler()
    scaler.fit(pd.concat([X_train, data_25.drop(columns=[rank_type])], axis=0))
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Log dönüşümü
    y_train_transformed = np.log1p(y_train)
    y_test_transformed = np.log1p(y_test)

    # Modeli tanımlama
    best_xgb = XGBRegressor(**params)

    # Modeli eğitme
    best_xgb.fit(X_train_scaled, y_train_transformed)

    # 2025 yılı için tahmin
    X_25_scaled = scaler.transform(data_25.drop(columns=[rank_type]))
    predict_25 = best_xgb.predict(X_25_scaled)
    predict_25 = np.expm1(predict_25)  # Log dönüşümünü geri al

    # 2025 yılı tahminlerini ekleyelim
    lastTable[f"PREDICTED_{rank_type}"] = predict_25

    return lastTable

for rank in ["LAST_RANK", "FIRST_RANK"]:
    lastTable = train_and_predict(data, data_25, rank, lastTable)  # Güncellenmiş lastTable'ı al

# Ortalama hesaplama
lastTable["Mean_Predicted"] = (lastTable["PREDICTED_LAST_RANK"] + lastTable["PREDICTED_FIRST_RANK"]) / 2

lastTable.index = data_25.index

# Sonuçları göster
print(lastTable[["PREDICTED_LAST_RANK", "PREDICTED_FIRST_RANK", "Mean_Predicted"]])

lastTable.to_csv("lastTable_2025.csv")


