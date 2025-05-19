import pandas as pd

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
data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

# 1. Bölümler Arası Popülerlik
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
# 2. Son ve İlk Öğrencilerin Puan Farkı
#data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
# 4. Bölümlerdeki Öğrencilerin Ortalama Sıralaması
data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2
# 5. Tüm Yılların ve Bölümlerin Doluluk Oranı Ortalaması
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean') #field rate ile aynı oluyordu
data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True) #yıllara göre olduğu için yılları sıralamamız gerekiyor
# 6. Bölümün Yıllara Göre Kapasite Değişimi
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
# 7. Bölümün Yıllara Göre Yerleşen Öğrenci Sayısı Değişimi
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
# 8. Puan Türünün Yıla Göre Popülerliği
data['SCORE_TYPE_POPULARITY'] = data.groupby(['YEAR_ID', 'SCORE_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# 10. Üniversitelerin Yıla Göre Popülerliği
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
# Önceki yıla göre doluluk oranı değişimi
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change() #enrollment_change_rate ile aynı işlevi görüyordu ve değerleri aynı
# Önceki yıla göre bölüm popülerliği değişimi
#data['POPULARITY_CHANGE'] = data.groupby('YEAR_ID')['DEPARTMENT_POPULARITY'].pct_change() #hepsi 0 geliyordu düşünülmeli
# Ortalama puan farkı
#data['AVERAGE_SCORE_DIFF'] = data["SCORE_DIFFERENCE"] / data['FIRST_SCORE']
#Yıla Göre Puan Değişimi
data['LAST_SCORE_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_SCORE'].pct_change()
data['FIRST_SCORE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_SCORE'].pct_change()
#Yıla Göre Sıralam Değişimi
data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()

column_nan_count=data.isnull().sum() # capacity_change_rate ve enrollment_change_rate değerlerinin null olması
data=data.dropna()

drop_columns = ['DEPARTMENT_ID', 'UNIVERSITY_ID', "FACULTY_NAME","DEPARTMENT_NAME",
                "YEAR_ID","SCHOLARSHIP_TYPE_ID","GENERAL_ENROLLMENT","SUM_ENROLLMENT","SUM_CAPACITY"]
data = data.drop(columns=drop_columns)

data=pd.get_dummies(data,columns=["SCORE_TYPE_ID"], dtype=int)


X=data.drop(columns=["LAST_RANK_CHANGE"])
y=data["LAST_RANK_CHANGE"]

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

corr_matrix = data.corr()
plt.figure(figsize=(12,10))
sns.heatmap(corr_matrix, cmap="coolwarm", annot=True)
plt.show()

#from sklearn.preprocessing import StandardScaler

#scaler=StandardScaler()
#X=scaler.fit_transform(X)

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test=train_test_split(X,y,test_size=0.1,random_state=42)


from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
# En iyi parametrelerle yeni modeli oluştur
best_xgb = XGBRegressor(
    colsample_bytree=0.8,
    learning_rate=0.05,  # Reduce learning rate
    max_depth=6,  # Increase depth slightly
    n_estimators=1000,  # More trees
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

predicted_table=data.copy()
predicted_table.drop(predicted_table.index,inplace=True)

import matplotlib.pyplot as plt

# Feature importances görselleştirme
plt.figure(figsize=(10, 6))
plt.barh(X.columns, best_xgb.feature_importances_)
plt.xlabel("Önemi")
plt.ylabel("Özellikler")
plt.title("Özelliklerin Modeldeki Önemi")
plt.show()


#predicted_table.info()
#predicted_table.loc[len(predicted_table)]=[50,1.0,]










