import pandas as pd


# Veri setini yükleme
pure_data = pd.read_csv('lisans_data.csv',encoding="unicode_escape")
data = pd.read_csv('lisans_data.csv',encoding="unicode_escape")

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





# 1. Bölümler Arası Popülerlik
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')

# 2. Son ve İlk Öğrencilerin Puan Farkı
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']

# 3. Her Yılın Doluluk Oranı
data['YEARLY_FIELD_RATE'] = data['SUM_ENROLLMENT'] / data['SUM_CAPACITY'] #field rate ile aynı

# 4. Bölümlerdeki Öğrencilerin Ortalama Sıralaması
data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2

# 5. Tüm Yılların Doluluk Oranı Ortalaması
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['YEARLY_FIELD_RATE'].transform('mean')

# 6. Bölümün Yıllara Göre Kapasite Değişimi
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()

# 7. Bölümün Yıllara Göre Yerleşen Öğrenci Sayısı Değişimi
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()

# 8. Bölümün Puan Türüne Göre Popülerliği
data['SCORE_TYPE_POPULARITY'] = data.groupby(['DEPARTMENT_ID', 'SCORE_TYPE_ID'])['YEARLY_FIELD_RATE'].transform('mean')

# 9. Bölümün Burs Türüne Göre Popülerliği
data['SCHOLARSHIP_POPULARITY'] = data.groupby(['DEPARTMENT_ID', 'SCHOLARSHIP_TYPE_ID'])['YEARLY_FIELD_RATE'].transform('mean')

# 10. Bölümün Üniversiteye Göre Popülerliği
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'DEPARTMENT_ID'])['YEARLY_FIELD_RATE'].transform('mean')

# Önceki yıla göre doluluk oranı değişimi
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['YEARLY_FIELD_RATE'].pct_change()

# Önceki yıla göre bölüm popülerliği değişimi
data['POPULARITY_CHANGE'] = data.groupby('DEPARTMENT_ID')['DEPARTMENT_POPULARITY'].pct_change()

# Ortalama puan farkı
data['AVERAGE_SCORE_DIFF'] = (data['FIRST_SCORE'] - data['LAST_SCORE']) / data['FIRST_SCORE']




column_nan_count=data.isnull().sum() # capacity_change_rate ve enrollment_change_rate değerlerinin null olması
data=data.dropna() #bu kısımda capacity ve enrollment change rate değerlerinin ilk verileri her türlü nan olacak normal yani

data['CAPACITY_TREND'] = data['CAPACITY_CHANGE_RATE'].apply(lambda x: 1 if x > 0 else 0)
drop_columns = ['DEPARTMENT_ID', 'UNIVERSITY_ID', 'SCORE_TYPE_ID', 'SCHOLARSHIP_TYPE_ID',"FACULTY_NAME","DEPARTMENT_NAME"]
data = data.drop(columns=drop_columns)
pure_data=data
#data=pd.get_dummies(data,columns=["SCHOLARSHIP_TYPE_ID"]) #kategorik olan veriyi makinenin anlayacağı şekilde dönüştürmek
#scholarshiptype id kategorik numaralar sayısal veri değil aslında

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

real_data = pure_data[pure_data["YEAR_ID"] == 24] # Son yılı test etmek
real_data_predictions = best_xgb.predict(real_data.drop(columns=['CAPACITY_CHANGE_RATE']))
print(real_data_predictions)

import matplotlib.pyplot as plt

plt.hist(real_data_predictions, bins=30, edgecolor='black')
plt.xlabel("Tahmin Edilen Kapasite Değişimi")
plt.ylabel("Bölüm Sayısı")
plt.title("2024 Bölüm Kapasite Değişim Tahminleri")
plt.show()

plt.hist(real_data_predictions, bins=30, edgecolor='black', log=True)
plt.xlabel("Tahmin Edilen Kapasite Değişimi (Log)")
plt.ylabel("Bölüm Sayısı")
plt.title("Log Skalada Kapasite Değişim Tahminleri")
plt.show()

aykiri_veriler = real_data_predictions[real_data_predictions > 10]
print(aykiri_veriler)

importances = best_xgb.feature_importances_
features = X.columns
feature_importance = pd.DataFrame({'Feature': features, 'Importance': importances})
feature_importance.sort_values(by='Importance', ascending=False, inplace=True)
print(feature_importance)


corr_matrix = data.corr()
print(corr_matrix['CAPACITY_CHANGE_RATE'].sort_values(ascending=False))







