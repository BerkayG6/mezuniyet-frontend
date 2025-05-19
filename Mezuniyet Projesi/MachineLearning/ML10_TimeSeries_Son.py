import pandas as pd

# CSV dosyasını okuma
forecast_df = pd.read_csv("forecast_results.csv", encoding="utf-8")

# Yıl sütununu datetime formatına çevir
forecast_df['ds'] = pd.to_datetime(forecast_df['ds'])

# Yalnızca '12-31' tarihli verileri seçme
end_of_year_data = forecast_df[forecast_df['ds'].dt.strftime('%Y-%m-%d') == '2024-12-31']

# Pivot işlemi: METRIC değerlerini sütun olarak kullan
pivot_df = end_of_year_data.pivot_table(index=['ds', 'DEPARTMENT_ID'], columns='METRIC', values='yhat').reset_index()

# Yeni tabloyu görüntüleme
print(pivot_df.head())

"""---------------------------------------İkinci Phase----------------------------"""

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
data=data.dropna() #bu kısımda capacity ve enrollment change rate değerlerinin ilk verileri her türlü nan olacak normal yani


drop_columns = ['DEPARTMENT_ID', 'UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "SCHOLARSHIP_TYPE_ID","SCORE_TYPE_ID","YEAR_ID"]
data = data.drop(columns=drop_columns)


import seaborn as sns
import matplotlib.pyplot as plt

corr_matrix = data.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

from sklearn.model_selection import train_test_split

X = data.drop(columns=['ENROLLMENT_CHANGE_RATE'])  # Bağımsız değişkenler
y = data['ENROLLMENT_CHANGE_RATE']  # Hedef değişken

from sklearn.preprocessing import StandardScaler

scaler=StandardScaler()
X=scaler.fit_transform(X)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)


from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import RandomizedSearchCV #grid searchten daha hızlı ve veri fazla olduğu için bunu seçiyoruz
import numpy as np
from sklearn.metrics import mean_absolute_error, r2_score


"""
param_dist = {
    'n_estimators': np.arange(100, 1000, 100),
    'max_depth': np.arange(3, 10, 1),
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

print("Best parameters:",random_search.best_params_)
Fitting 5 folds for each of 20 candidates, totalling 100 fits
Best parameters: {'subsample': 0.6, 'n_estimators': 400, 'max_depth': 9, 'learning_rate': 0.1577777777777778, 'colsample_bytree': 1.0}
"""

best_xgb = XGBRegressor(
    colsample_bytree=1.0,
    learning_rate=0.15,
    max_depth=9,
    n_estimators=400,
    subsample=0.6,
    random_state=42
)

#model eğitme
best_xgb.fit(X_train,y_train)

#tahmin yapma
y_pred=best_xgb.predict(X_test)

# score ve error belirleme
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("MAE:", mae)
print("R2 Score:", r2)
#MAE 0.05 R2 SCORE DA 0.92


#xgboost sayesinde feature importances ile hangi özelliklerin önemli olduğunu anlıyoruz
importances = best_xgb.feature_importances_


feature_names = data.drop(columns=['ENROLLMENT_CHANGE_RATE']).columns

#sortlama
indices = importances.argsort()

# plt
plt.figure(figsize=(12, 8))
plt.title('Feature Importances')
plt.barh(range(len(indices)), importances[indices], align='center')
plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
plt.xlabel('Relative Importance')
plt.show()
