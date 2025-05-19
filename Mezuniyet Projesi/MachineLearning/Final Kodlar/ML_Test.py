import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

# <------------------Veri Yükleme ve Düzenleme---------------------------->


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
"""
#outlier bulma
from collections import Counter

def detect_outliers(df,features):
    outlier_indices=[]
    
    for c in features:
        Q1=np.percentile(df[c],25)
        Q3=np.percentile(df[c],75)
        IQR=Q3-Q1
        outlier_step=IQR*1.5
        outlier_list_col=df[(df[c] <Q1- outlier_step) | (df[c]>Q3+outlier_step)].index
        outlier_indices.extend(outlier_list_col)
    
    outlier_indices=Counter(outlier_indices)
    multiple_outliers=list(i for i, v in outlier_indices.items() if v>2)
    return multiple_outliers

data.loc[detect_outliers(data, ["SUM_ENROLLMENT","SUM_CAPACITY"])]
data=data.drop(detect_outliers(data, ["SUM_ENROLLMENT","SUM_CAPACITY"]),axis=0).reset_index(drop=True)
bir şey değişmedi
"""

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

# <------------------Yeni Featurelar Üretme---------------------------->


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

# <------------------Az Yıla Sahip Bölümleri Kaldırma---------------------------->


#iki yıl ve daha az veriye sahip olan department idleri çıkarıyorum.
#çünkü 2019da enrollment değeri 0 oluyor ve 2024de o bölümü açıyorlar enrollment 92 oluyor bu outlier değerler oluyor aslında
dept_year_counts=data.groupby("DEPARTMENT_ID")["YEAR_ID"].nunique()
low_departments=dept_year_counts[dept_year_counts<=2].index
data=data[~data["DEPARTMENT_ID"].isin(low_departments)]


data_2025=data.copy() #2025 predict için veri kopyalama

data_24=data[data["YEAR_ID"]==24] #2024 verilerini kullanarak modeli doğrulamak için veri kopyalama

data=data[data.YEAR_ID !=24]
data = data.set_index('DEPARTMENT_ID')
data_24 = data_24.set_index('DEPARTMENT_ID')

drop_columns = [ 'UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID"]


data = data.drop(columns=drop_columns)
data_24=data_24.drop(columns=drop_columns)

# <------------------Veriler Arasındaki İlişki Gösterimi---------------------------->


import seaborn as sns
import matplotlib.pyplot as plt

corr_matrix = data.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

# <------------------Train ve Test Verilerini Hazırlama---------------------------->


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = data.drop(columns=['ENROLLMENT_CHANGE_RATE'])  # Bağımsız değişkenler
y = data['ENROLLMENT_CHANGE_RATE']  # Hedef değişken=bağımlı


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler=StandardScaler()
X_train_scaled=scaler.fit_transform(X_train)#eğitim verisi olduğu için fit etmemiz gerekiyor
X_test_scaled=scaler.transform(X_test)#test verisini sadece transform etmemiz yeterli çünkü eğitim verisi test verisine ait özellikleri görebiliyor fit edersek.
#ayrıca eğitimde öğrenilen ölçek kurallarına göre transform yapılır.

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from sklearn.model_selection import RandomizedSearchCV,KFold,cross_val_score #grid searchten daha hızlı ve veri fazla olduğu için bunu seçiyoruz

# <------------------Uygun Parametreleri Bulma---------------------------->

"""
param_dist = {
    'n_estimators': np.arange(100, 1000, 100),
    'max_depth': np.arange(1, 10, 1),
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
Best parameters: {'subsample': 0.8, 'n_estimators': 300, 'max_depth': 8, 'learning_rate': 0.052222222222222225, 'colsample_bytree': 1.0}
print("Best parameters:",random_search.best_params_) bu parametrelerle r3:0.74
"""
# <------------------Modeli Hazırlama---------------------------->


best_xgb = XGBRegressor(
    n_estimators=300, # Ağaç sayısını artırarak daha iyi genelleme sağlarız
   learning_rate=0.05, # Daha düşük öğrenme oranı modelin daha iyi genelleme yapmasını sağlar.
   max_depth=3, # Daha az derinlik aşırı öğrenmeyi azaltır.
   reg_alpha=0.1,  # L1 Regularization (Özellik seçiminde etkili olur)
   reg_lambda=0.5 , #L2 Regularization (Overfitting’i engeller)
    random_state=42
)
"""
ÖNEMLİ!!!!!!!!!!
OVERFİTTİNG YAPTIĞI İÇİN BİRKAÇ PARAMETREYİ DÜZENLEDİM. MAX._DEPTH 3 OLDU.
TEST HATASI EĞİTİM HATASINA YAKLAŞTI OVERFİTTİNG VAR MI ŞUAN BELİRSİZ
"""

# <------------------Modeli Eğitme ve Tahmin Kısmı---------------------------->


#model eğitme
best_xgb.fit(X_train_scaled,y_train)

#tahmin yapma
y_pred=best_xgb.predict(X_test_scaled)
y_train_pred=best_xgb.predict(X_train_scaled)

#overfitting var mı ona bakalım
mae_ytrain_pred=mean_absolute_error(y_train, y_train_pred) #0.002537468864879467 eğitim hatası

#max_depth 9 iken 0.0025- 0.06 oluyor yani oveefitting max_depth 1 olunca eşitlenyorlar ama score 0.90 oluyor
r2_ytrain=r2_score(y_train,y_train_pred)#0.99999


# score ve error belirleme
mae = mean_absolute_error(y_test, y_pred) #0.061162383567099965  test hatası
r2 = r2_score(y_test, y_pred)

print("Overfitting var mı ? Mae_ytrain_pred: ",mae_ytrain_pred," Mae: ",mae)
#Mae_ytrain_pred , mae değerinden küçük olduğu için overfitting var -> Test hatası eğitim hatasından küçük olmalı


print("MAE:", mae)
print("R2 Score:", r2)
#MAE: 0.061162383567099965
#R2 Score: 0.9462741780164474

"""
k_folds=KFold(n_splits=5)
scores=cross_val_score(best_xgb, X,y,cv=k_folds)
print("Cross Validation Scores: ", scores)
print("Average CV Score: ", scores.mean())
print("Number of CV Scores used in Average: ", len(scores))
#Cross Validation Scores:  [0.9408787  0.93906571 0.93805082 0.87228294 0.94431831]
#Cross validation ile daha iyi scorelar üretebiliyor muyuz onu anlıyoruz.
"""

# <------------------Hangi Featureler Modeli Eğitiminde Etkili---------------------------->

importances = best_xgb.feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
print(feature_importance_df)


# <------------------2024 Verilerini Kullanarak Tahmin ve Gerçek Değerleri Karşılaştırma---------------------------->


A=data_24.drop(columns=["ENROLLMENT_CHANGE_RATE"])
B=data_24["ENROLLMENT_CHANGE_RATE"]

A_scaled=scaler.transform(A)

predict=best_xgb.predict(A_scaled)
r3=r2_score(B,predict)
print("2024 verilerini kullanarak 2024ü tahmin ettik ve doğruluk oranı:",r3)
#0.8072924121498732

lastTable = pd.concat([B.reset_index(), pd.Series(predict, name="Predicted_ENROLLMENT_CHANGE_RATE")], axis=1)



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

wannaPredict = result.loc[wannaDepartment].drop("ENROLLMENT_CHANGE_RATE")
wannaPredict = wannaPredict.values.reshape(1, -1)
wannaPredict_scaled = scaler.transform(wannaPredict)
predicted = best_xgb.predict(wannaPredict_scaled)
print(wannaDepartment," bölüm koduna ait 2025 enrollment change rate değeri: ",predicted)




