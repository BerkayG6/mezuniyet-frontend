import pandas as pd


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

data_2025=data.copy()

data_24=data[data["YEAR_ID"]==24]

data=data[data.YEAR_ID !=24]
data = data.set_index('DEPARTMENT_ID')
data_24 = data_24.set_index('DEPARTMENT_ID')

drop_columns = ['UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID"]
data = data.drop(columns=drop_columns)
data_24=data_24.drop(columns=drop_columns)

from sklearn.model_selection import train_test_split

X = data.drop(columns=['LAST_RANK'])  # Bağımsız değişkenler
y = data['LAST_RANK']  # Hedef değişken





X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


from sklearn.preprocessing import StandardScaler

scaler=StandardScaler()
X_train_scaled=scaler.fit_transform(X_train)
X_test_scaled=scaler.transform(X_test)
#StandartScaler kullanarak 2024 için daha iyi doğruluk oranına ulaştık ve - değerler azaldı.
#fakat hata payı yüksek olduğu için lastTableda değerlerin aralığı biraz açıldı

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import RandomizedSearchCV,KFold,cross_val_score #grid searchten daha hızlı ve veri fazla olduğu için bunu seçiyoruz
import numpy as np
from sklearn.metrics import mean_absolute_error, r2_score

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

random_search.fit(X_train,y_train)
#Best parameters: {'subsample': 0.6, 'n_estimators': 600, 'max_depth': 11, 'learning_rate': 0.01, 'colsample_bytree': 1.0}
print("Best parameters:",random_search.best_params_) #bu parametrelerle r3:0.91 r2:0.97 mae:24817 güzel sonuc eskisine göre ve - değerler de yok
"""
best_xgb = XGBRegressor(
    colsample_bytree=1.0,
    learning_rate=0.01,
    max_depth=5,
    n_estimators=600,
    subsample=0.6,
    random_state=42
)

#model eğitme
best_xgb.fit(X_train_scaled,y_train)

#tahmin yapma
y_pred=best_xgb.predict(X_test_scaled)
y_train_pred=best_xgb.predict(X_train_scaled)

# score ve error belirleme
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

mae_ytrain_pred=mean_absolute_error(y_train,y_train_pred)
print("Overfitting var mı ? Mae_ytrain_pred: ",mae_ytrain_pred," Mae: ",mae)
#Mae_ytrain_pred , mae değerinden küçük olduğu için overfitting var  Overfitting var mı ? Mae_ytrain_pred:  11158.875273872085  Mae:  24817.002347825095


print("MAE:", mae)
print("R2 Score:", r2)
"""
k_folds=KFold(n_splits=5)
scores=cross_val_score(best_xgb, X,y,cv=k_folds)
print("Cross Validation Scores: ", scores)
print("Average CV Score: ", scores.mean())
print("Number of CV Scores used in Average: ", len(scores))
Cross Validation Scores:  [0.97030868 0.97347954 0.97120342 0.95630898 0.95745079]
Average CV Score:  0.9657502810858783
Number of CV Scores used in Average:  5
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

A=data_24.drop(columns=["LAST_RANK"])
B=data_24["LAST_RANK"]

A_scaled=scaler.transform(A)


predict=best_xgb.predict(A_scaled)
r3=r2_score(B,predict)
print("2024 verilerini kullanarak 2024ü tahmin ettik ve doğruluk oranı:",r3)


lastTable = pd.concat([B.reset_index(), pd.Series(predict, name="Predicted_LAST_RANK")], axis=1)

# <------------------2025 Tahmin---------------------------->

data_2025=data_2025.drop(columns=['UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID"])

valid_departments = data_2025[data_2025['YEAR_ID'].isin([24, 23, 22])].groupby('DEPARTMENT_ID')['YEAR_ID'].nunique()
valid_departments = valid_departments[valid_departments == 3].index  # Tüm yılları içerenleri al

# Yalnızca geçerli departmanları filtrele
filtered_df = data_2025[data_2025['DEPARTMENT_ID'].isin(valid_departments)]

# Ortalamaları hesapla
result = filtered_df.groupby('DEPARTMENT_ID').mean(numeric_only=True).drop(columns=['YEAR_ID'])

wannaDepartment=201190054

wannaPredict = result.loc[wannaDepartment].drop("LAST_RANK")
wannaPredict = wannaPredict.values.reshape(1, -1)
wannaPredict_scaled = scaler.transform(wannaPredict)
predicted = best_xgb.predict(wannaPredict_scaled)

print(wannaDepartment," bölüm koduna ait tahmini 2025 last rank değeri: ",predicted)

# pure_data veri setinde sadece istenen departman koduna sahip satırları filtrele
selected_data = pure_data[pure_data['DEPARTMENT_ID'] == wannaDepartment]

# Filtrelenmiş veriyi yazdırma
print("Seçilen bölümün diğer yıllardaki verileri: ",selected_data[['YEAR_ID', 'LAST_RANK']])


