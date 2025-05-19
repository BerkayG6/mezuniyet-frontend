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

array=["LAST_RANK","FIRST_RANK"]

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import RandomizedSearchCV,KFold,cross_val_score #grid searchten daha hızlı ve veri fazla olduğu için bunu seçiyoruz
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
scaler=StandardScaler()

lastTable=pd.DataFrame()

def train_test(data,array,data_24,lastTable):
    
    for i in range(0,2):
        data=data
        X = data.drop(columns=[array[i]])  # Bağımsız değişkenler
        y = data[array[i]]  # Hedef değişken
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        
        X_train_scaled=scaler.fit_transform(X_train)
        X_test_scaled=scaler.transform(X_test)

        y_train_transformed = np.log1p(y_train)
        y_test_transformed = np.log1p(y_test)
        
        best_xgb = XGBRegressor(
            colsample_bytree=1.0, #ağaç oluştururken kullanılacak özellik oranı
            learning_rate=0.01, #nasıl aralıklarla öğrensin
            max_depth=4, #ağaç derinliği
            n_estimators=600, #ağaç sayısı
            subsample=0.6, #veri alt küme oranı
            random_state=42
        )

        #model eğitme
        best_xgb.fit(X_train_scaled,y_train_transformed)

        #tahmin yapma
        y_pred=best_xgb.predict(X_test_scaled)
        y_train_pred=best_xgb.predict(X_train_scaled)

        # score ve error belirleme
        mae = mean_absolute_error(y_test_transformed, y_pred)
        r2 = r2_score(y_test_transformed, y_pred)

        y_pred=np.expm1(y_pred)#logaritmik değerden gerçek değere dönüştürme

        mae_ytrain_pred=mean_absolute_error(y_train_transformed,y_train_pred)
        r2_ytrain_pred=r2_score(y_train_transformed,y_train_pred)
        print(array[i], " için Overfitting var mı ? Mae_ytrain_pred: ",mae_ytrain_pred," Mae: ",mae)
        #Mae_ytrain_pred , mae değerinden küçük olduğu için overfitting var  Overfitting var mı ? Mae_ytrain_pred:  11158.875273872085  Mae:  24817.002347825095
        #Son yapılan düzenlemelerle overfitting yok gibi bir şey Overfitting var mı ? Mae_ytrain_pred:  0.14287645104507507  Mae:  0.14962771236179653

        
        print(array[i]," 'e ait test skoru: ",r2)
        print(array[i]," 'e ait eğitim skoru: ",r2_ytrain_pred)
        print(array[i]," 'e ait test hatası: ",mae)
        print(array[i]," 'e ait eğitim hatası: ",mae_ytrain_pred)
        
        A=data_24.drop(columns=[array[i]])
        B=data_24[array[i]]
        
        A_scaled=scaler.transform(A)

        predict=best_xgb.predict(A_scaled)
        predict=np.expm1(predict)#model logaritmik değerlere göre eğitildiği için predicti eski haline getiriyoruz
        r3=r2_score(B,predict)

        print(array[i]," için 2024 verilerini kullanarak 2024ü tahmin ettik ve doğruluk oranı:",r3)
        
        
        lastTable[array[i]]=B
        lastTable[f"Predicted_{array[i]}"]=predict
    
        

        importances = best_xgb.feature_importances_
        feature_names = X.columns
        feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
        feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
        print(feature_importance_df)
        
    lastTable["Mean_Actual"]=(lastTable["LAST_RANK"]+lastTable["FIRST_RANK"])/2
    lastTable["Mean_Predicted"]=(lastTable["Predicted_LAST_RANK"]+lastTable["Predicted_FIRST_RANK"])/2
        
    return lastTable


train_test(data,array,data_24,lastTable)


