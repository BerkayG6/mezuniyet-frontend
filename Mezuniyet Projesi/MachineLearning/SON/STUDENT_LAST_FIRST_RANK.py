import pandas as pd
import numpy as np


#veri yükleme
data=pd.read_csv("lisans_data.csv",encoding="unicode_escape")
pure_data=pd.read_csv("lisans_data.csv",encoding="unicode_escape")

#veri kontrolü
data.info()
print(data.describe())

#veri düzenleme
data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',','.')
data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',','.')

convert_dict={"LAST_SCORE":float,"FIRST_SCORE":float}
data=data.astype(convert_dict)


#verideki dolmadı -- null olan değerleri integer olarak numaralandırmıştık. Şimdi onları belirliyoruz.
count_minus_one_schoolCapacity=data["SCHOOL_CAPACITY"].value_counts().get(-1,0)
count_minus_six_generalEnrollment=data["GENERAL_ENROLLMENT"].value_counts().get(-6,0)
count_minus_one_generalEnrollment=data["GENERAL_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_schoolEnrollment=data["SCHOOL_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_sumEnrollment=data["SUM_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_fieldRate=data["FIELD_RATE"].value_counts().get(-1,0)
count_minus_one_lastScore=data["LAST_SCORE"].value_counts().get(-1,0)
count_minus_two_lastScore=data["LAST_SCORE"].value_counts().get(-2,0)
count_minus_one_lastRank=data["LAST_RANK"].value_counts().get(-1,0)
count_minus_two_lastRank=data["LAST_RANK"].value_counts().get(-2,0)
count_minus_one_firstScore=data["FIRST_SCORE"].value_counts().get(-1,0)
count_minus_one_firstRank=data["FIRST_RANK"].value_counts().get(-1,0)
count_minus_six_firstRank=data["FIRST_RANK"].value_counts().get(-6,0)

#yapay zeka eğitimine etki etmeyeceği için kaldırıyoruz.
data=data.drop(columns=["SCHOOL_CAPACITY","SCHOOL_ENROLLMENT"]) #capacity için school kısmı silindi - gereksiz
data=data[data["GENERAL_ENROLLMENT"]!=-6] #genel yerleşme verileri null olan rowlar silindi
data=data[data["GENERAL_ENROLLMENT"]!=-1] #genel yerleşme verileri --- olan rowlar silindi
data=data[data["LAST_SCORE"]!=-2] #son kişinin Dolmadı verileri silindi
data=data[data["LAST_SCORE"]!=-1] #son kişinin --- olan verileri silindi


#bazı verilerde yerleşme verisi kontenjandan fazla olduğu için >1 oluyor. Düzeltiyoruz.
data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)


#bölümlerin farkını ortaya çıkarmak ve yapay zekada kullanmak için veriler üretmemiz gerekiyor.


# 1. Bölümler Arası Popülerlik
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
# 2. Son ve İlk Öğrencilerin Puan Farkı
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
# 4. Bölümlerdeki Öğrencilerin Ortalama Sıralaması
#data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2
# 5. Tüm Yılların ve Bölümlerin Doluluk Oranı Ortalaması
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean') #field rate ile aynı oluyordu
data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True) #yıllara göre olduğu için yılları sıralamamız gerekiyor
# 6. Bölümün Yıllara Göre Kapasite Değişimi
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
# 7. Bölümün Yıllara Göre Yerleşen Öğrenci Sayısı Değişimi
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
# 8. Puan Türünün Yıla Göre Popülerliği
#data['SCORE_TYPE_POPULARITY'] = data.groupby(['YEAR_ID', 'SCORE_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# 9. Bursun Yıla Türüne Göre Popülerliği
#data['SCHOLARSHIP_POPULARITY'] = data.groupby(['YEAR_ID', 'SCHOLARSHIP_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# 10. Üniversitelerin Yıla Göre Popülerliği
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# Önceki yıla göre doluluk oranı değişimi
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change() #enrollment_change_rate ile aynı işlevi görüyordu ve değerleri aynı
# Önceki yıla göre bölüm popülerliği değişimi
#data['POPULARITY_CHANGE'] = data.groupby('YEAR_ID')['DEPARTMENT_POPULARITY'].pct_change() #hepsi 0 geliyordu düşünülmeli
# Ortalama puan farkı
#data['AVERAGE_SCORE_DIFF'] = data["SCORE_DIFFERENCE"] / data['FIRST_SCORE']
#rank değişimi
data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change() #enrollment_change_rate ile aynı işlevi görüyordu ve değerleri aynı
data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change() #enrollment_change_rate ile aynı işlevi görüyordu ve değerleri aynı

#Departmanları unique olarak değerlendiriyoruz. Sadece sum enrollment ve sum capacity 
#değerlerini karşılaştırmak doğru olmaz. Rank değerleri de department popularity için önemli


column_nan_count=data.isnull().sum() # capacity_change_rate ve enrollment_change_rate değerlerinin null olması
data=data.dropna()



data_24=data[data["YEAR_ID"]==24]

data=data[data.YEAR_ID !=24]
data = data.set_index('DEPARTMENT_ID')
data_24 = data_24.set_index('DEPARTMENT_ID')

drop_columns = ['UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID"]
data = data.drop(columns=drop_columns)
data_24=data_24.drop(columns=drop_columns)

import seaborn as sns
import matplotlib.pyplot as plt

corr_matrix = data.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

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
            max_depth=5, #ağaç derinliği
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
    
    lastTable["Mean_Actual"]=(lastTable["LAST_RANK"]+lastTable["FIRST_RANK"])/2
    lastTable["Mean_Predicted"]=(lastTable["Predicted_LAST_RANK"]+lastTable["Predicted_FIRST_RANK"])/2
        
    return lastTable

train_test(data,array,data_24,lastTable)

"""
param_dist = {
    'n_estimators': np.arange(100, 1000, 100),
    'max_depth': np.arange(1, 13, 1),
    'learning_rate': np.linspace(0.01, 0.2, 10),
    'subsample': np.linspace(0.6, 1.0, 5),
    'colsample_bytree': np.linspace(0.6, 1.0, 5)
}

random_search = RandomizedSearchCV(estimator=XGBRegressor(random_state=42),
                                   param_distributions=param_dist,
                                   scoring='neg_mean_absolute_error',
                                   n_iter=20,  # Number of random samples
                                   cv=5, #veriyi kaç parçaya bölerek yapsın(kaç katlı çapraz doğrulama)
                                   verbose=1, #log detayı
                                   n_jobs=-1 )#kaç işlemci çekirdeği kullansın

random_search.fit(X_train,y_train_transformed)
#Best parameters: {'subsample': 0.6, 'n_estimators': 600, 'max_depth': 11, 'learning_rate': 0.01, 'colsample_bytree': 1.0}
#Değişikliklerden sonraki parametreler Best parameters: {'subsample': 0.7, 'n_estimators': 800, 'max_depth': 9, 'learning_rate': 0.09444444444444444, 'colsample_bytree': 0.9}
print("Best parameters:",random_search.best_params_) #bu parametrelerle r3:0.91 r2:0.97 mae:24817 güzel sonuc eskisine göre ve - değerler de yok
"""



"""
k_folds=KFold(n_splits=5)
scores=cross_val_score(best_xgb, X,y,cv=k_folds)
print("Cross Validation Scores: ", scores)
print("Average CV Score: ", scores.mean())
print("Number of CV Scores used in Average: ", len(scores))
#Cross Validation Scores:  [0.94963493 0.95589904 0.95170633 0.94515321 0.95126802]
#Average CV Score:  0.9657502810858783
#Number of CV Scores used in Average:  5
"""

"""
importances = best_xgb.feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
print(feature_importance_df)

import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(12,6))
sns.barplot(x=feature_importance_df['Importance'], y=feature_importance_df['Feature'])
plt.title("Feature Importance in XGBoost Model")
plt.show()
"""












