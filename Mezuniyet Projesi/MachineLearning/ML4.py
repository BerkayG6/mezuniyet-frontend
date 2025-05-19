
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

data=data.drop(columns=["SCHOOL_CAPACITY","SCHOOL_ENROLLMENT"]) #capacity için school kısmı silindi - gereksiz
data=data[data["GENERAL_ENROLLMENT"]!=-6] #genel yerleşme verileri null olan rowlar silindi
data=data[data["GENERAL_ENROLLMENT"]!=-1] #genel yerleşme verileri --- olan rowlar silindi
data=data[data["LAST_SCORE"]!=-2] #son kişinin Dolmadı verileri silindi
data=data[data["LAST_SCORE"]!=-1] #son kişinin --- olan verileri silindi

data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

#yeni özellikler türetme

# 1. Bölümler Arası Popülerlik
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
# 2. Son ve İlk Öğrencilerin Puan Farkı
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
# 4. Bölümlerdeki Öğrencilerin Ortalama Sıralaması
data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2
# 5. Tüm Yılların ve Bölümlerin Doluluk Oranı Ortalaması
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean') #field rate ile aynı oluyor
data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True) #yıllara göre olduğu için yılları sıralamamız gerekiyor
# 6. Bölümün Yıllara Göre Kapasite Değişimi
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
# 7. Bölümün Yıllara Göre Yerleşen Öğrenci Sayısı Değişimi
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
# 8. Puan Türünün Yıla Göre Popülerliği
data['SCORE_TYPE_POPULARITY'] = data.groupby(['YEAR_ID', 'SCORE_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# 9. Bursun Yıla Türüne Göre Popülerliği
data['SCHOLARSHIP_POPULARITY'] = data.groupby(['YEAR_ID', 'SCHOLARSHIP_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# 10. Üniversitelerin Yıla Göre Popülerliği
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# Önceki yıla göre doluluk oranı değişimi
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change() #enrollment_change_rate ile aynı işlevi görüyor ve değerleri aynı
# Önceki yıla göre bölüm popülerliği değişimi
data['POPULARITY_CHANGE'] = data.groupby('YEAR_ID')['DEPARTMENT_POPULARITY'].pct_change() #hepsi 0 geliyor düşünülmeli
# Ortalama puan farkı
data['AVERAGE_SCORE_DIFF'] = data["SCORE_DIFFERENCE"] / data['FIRST_SCORE']


column_nan_count=data.isnull().sum() # capacity_change_rate ve enrollment_change_rate değerlerinin null olması
data=data.dropna() #bu kısımda capacity ve enrollment change rate değerlerinin ilk verileri her türlü nan olacak normal yani

data['CAPACITY_TREND'] = data['CAPACITY_CHANGE_RATE'].apply(lambda x: 1 if x > 0 else 0)
drop_columns = ["FACULTY_NAME","DEPARTMENT_NAME","SCHOLARSHIP_TYPE_ID"]
data = data.drop(columns=drop_columns)

data=pd.get_dummies(data,columns=["DEPARTMENT_ID"],dtype=int)
data=pd.get_dummies(data,columns=["UNIVERSITY_ID"],dtype=int)
data=pd.get_dummies(data,columns=["YEAR_ID"],dtype=int)
data=pd.get_dummies(data,columns=["SCORE_TYPE_ID"],dtype=int)

from sklearn.model_selection import train_test_split

X = data.drop(columns=['CAPACITY_CHANGE_RATE'])  # Bağımsız değişkenler
y = data['CAPACITY_CHANGE_RATE']  # Hedef değişken

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# En iyi parametrelerle yeni modeli oluştur
best_xgb = XGBRegressor(
    colsample_bytree=0.8,
    learning_rate=0.2,
    max_depth=4,
    n_estimators=500,
    subsample=0.8,
    random_state=42
)

# Modeli eğit
best_xgb.fit(X_train, y_train)

# Tahmin yap
y_pred = best_xgb.predict(X_test)

# Performans değerlendirme
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("MAE:", mae)
print("R2 Score:", r2)


# 2025 için yeni veri oluşturmak
latest_data = data[data['YEAR_ID_24'] == 1].copy()  # 2024 verisini al

latest_data['YEAR_ID_25'] = 1  # 2025 yılı
latest_data['SUM_ENROLLMENT'] = latest_data['SUM_ENROLLMENT'] * (1 + latest_data['ENROLLMENT_CHANGE_RATE'].fillna(0))  # Değişim oranı ile güncelle
latest_data['FIELD_RATE'] = latest_data['FIELD_RATE'].clip(upper=1)  # 1'i geçmeyecek şekilde ayarla
latest_data['SCORE_DIFFERENCE'] = latest_data['SCORE_DIFFERENCE']  # Aynı bırak (veya başka bir yöntem kullan)
latest_data['AVERAGE_RANK'] = latest_data['AVERAGE_RANK']  # Sıralama değişmeyebilir
latest_data['UNIVERSITY_POPULARITY'] = latest_data['UNIVERSITY_POPULARITY']  # Aynı tut
latest_data['CAPACITY_TREND'] = latest_data['CAPACITY_TREND']  # Trend değişmeden bırak



# Tahmin için bağımsız değişkenlerden oluşan 2025 verisi
X_2025 = latest_data.drop(columns=['CAPACITY_CHANGE_RATE'])

X_2025 = pd.get_dummies(X_2025)
X_2025 = X_2025.reindex(columns=X.columns, fill_value=0)  # Aynı sütunları garanti altına al



# 2025 yılı için tahmin yap
y_2025_pred = best_xgb.predict(X_2025)

# Sonuçları ekleyin
latest_data['CAPACITY_CHANGE_RATE_PRED'] = y_2025_pred

# Artış/Azalış durumu
latest_data['CAPACITY_CHANGE_STATUS'] = latest_data['CAPACITY_CHANGE_RATE_PRED'].apply(
    lambda x: 'Artış' if x > 0 else ('Azalış' if x < 0 else 'Aynı')
)

# 2025 tahmini sonuçlarını incele
print(latest_data[['YEAR_ID_25', 'SUM_ENROLLMENT', 'FIELD_RATE', 'CAPACITY_CHANGE_RATE_PRED', 'CAPACITY_CHANGE_STATUS']])

latest_data=latest_data.merge(pure_data[["DEPARTMENT_ID"]],left_index=True,right_index=True,how="left")


importances = best_xgb.feature_importances_
features = X.columns
feature_importance = pd.DataFrame({'Feature': features, 'Importance': importances})
feature_importance.sort_values(by='Importance', ascending=False, inplace=True)
print(feature_importance)



