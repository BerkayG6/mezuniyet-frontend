import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")


data=pd.read_csv("lisans_data.csv",encoding="unicode_escape")
data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',','.')
data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',','.')

convert_dict={"LAST_SCORE":float,"FIRST_SCORE":float}
data=data.astype(convert_dict)

data=data.drop(columns=["SCHOOL_CAPACITY","SCHOOL_ENROLLMENT"]) #capacity için school kısmı silindi - gereksiz
data=data[data["GENERAL_ENROLLMENT"]!=-6] #genel yerleşme verileri null olan rowlar silindi
data=data[data["GENERAL_ENROLLMENT"]!=-1] #genel yerleşme verileri --- olan rowlar silindi
data=data[data["LAST_SCORE"]!=-2] #son kişinin Dolmadı verileri silindi
data=data[data["LAST_SCORE"]!=-1] #son kişinin --- olan verileri silindi
data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

dataCorr=data.copy()
dataCorr=dataCorr.drop(columns=["UNIVERSITY_ID","FACULTY_NAME","DEPARTMENT_NAME","SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID","DEPARTMENT_ID"])

import seaborn as sns
import matplotlib.pyplot as plt

corr_matrix = dataCorr.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

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
    
# Field rate 
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
data['FIELD_RATE_STABILITY'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('std')
data['FIELD_RATE_TREND'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform(lambda x: x.pct_change().mean())
    

data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)
    
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

# Competition metrics
data['COMPETITION_LEVEL'] = data['SCORE_DIFFERENCE'] * data['FIELD_RATE']
data['SELECTIVITY'] = data['FIRST_SCORE'] * (1 - data['FIELD_RATE'])
    
# Remove any remaining NaN values
data = data.dropna()

dataCorr=data.copy()
dataCorr=dataCorr.drop(columns=["UNIVERSITY_ID","FACULTY_NAME","DEPARTMENT_NAME","SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID","DEPARTMENT_ID"])

corr_matrix = dataCorr.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

data=data.drop(columns=["ENROLLMENT_EFFICIENCY","AVERAGE_FIELD_RATE"])

#iki yıl ve daha az veriye sahip olan department idleri çıkarıyorum.
#çünkü 2019da enrollment değeri 0 oluyor ve 2024de o bölümü açıyorlar enrollment 92 oluyor bu outlier değerler oluyor aslında
dept_year_counts=data.groupby("DEPARTMENT_ID")["YEAR_ID"].nunique()
low_departments=dept_year_counts[dept_year_counts<=2].index
data=data[~data["DEPARTMENT_ID"].isin(low_departments)]

data_24=data[data["YEAR_ID"]==24] #2024 verilerini kullanarak modeli doğrulamak için veri kopyalama

data=data[data.YEAR_ID !=24]
data = data.set_index('DEPARTMENT_ID')
data_24 = data_24.set_index('DEPARTMENT_ID')


drop_columns = [ 'UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID"]


data = data.drop(columns=drop_columns)
data_24=data_24.drop(columns=drop_columns)

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.svm import SVR


X = data.drop(columns=['ENROLLMENT_CHANGE_RATE'])  # Bağımsız değişkenler
y = data['ENROLLMENT_CHANGE_RATE']  # Hedef değişken=bağımlı


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler=StandardScaler()
X_train_scaled=scaler.fit_transform(X_train)#eğitim verisi olduğu için fit etmemiz gerekiyor
X_test_scaled=scaler.transform(X_test)#test verisini sadece transform etmemiz yeterli çünkü eğitim verisi test verisine ait özellikleri görebiliyor fit edersek.
#ayrıca eğitimde öğrenilen ölçek kurallarına göre transform yapılır.

best_xgb = XGBRegressor(
    n_estimators=300, # Ağaç sayısını artırarak daha iyi genelleme sağlarız
   learning_rate=0.05, # Daha düşük öğrenme oranı modelin daha iyi genelleme yapmasını sağlar.
   max_depth=3, # Daha az derinlik aşırı öğrenmeyi azaltır.
   reg_alpha=0.1,  # L1 Regularization (Özellik seçiminde etkili olur)
   reg_lambda=0.5 , #L2 Regularization (Overfitting’i engeller)
    random_state=42
)
# RandomizedSearchCV ile bulunan parametreler overfitting yaratıyor. Karmaşıklığı azaltmak için ağaç sayısını ve derinliği düşürmek gerekiyor.

best_xgb.fit(X_train_scaled,y_train) #Model Eğitimi

y_pred=best_xgb.predict(X_test_scaled) #Model Tahmin
y_train_pred=best_xgb.predict(X_train_scaled) #Eğitim içindeki tahmin

mae_ytrain_pred=mean_absolute_error(y_train, y_train_pred) #Eğitim hatası
r2_ytrain=r2_score(y_train,y_train_pred) #Eğitim skoru

mae = mean_absolute_error(y_test, y_pred) #Ana -> Test hatası
r2 = r2_score(y_test, y_pred) #Test skoru

print("Overfitting var mı ? Mae_ytrain_pred: ",mae_ytrain_pred," Mae: ",mae) #Test hatası eğitim hatasından büyük ise overfitting olabilir

print("Test MAE:", mae)
print("Test R2 Score:", r2)
print("Eğitim MAE:", mae_ytrain_pred)
print("Eğitim R2 Score:", r2_ytrain)

importances = best_xgb.feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
print(feature_importance_df)

A=data_24.drop(columns=["ENROLLMENT_CHANGE_RATE"])
B=data_24["ENROLLMENT_CHANGE_RATE"]

A_scaled=scaler.transform(A)

predict=best_xgb.predict(A_scaled)
r3=r2_score(B,predict)
print("2024 verilerini kullanarak 2024ü tahmin ettik ve doğruluk oranı:",r3)


lastTable = pd.concat([B.reset_index(), pd.Series(predict, name="Predicted_ENROLLMENT_CHANGE_RATE")], axis=1)





