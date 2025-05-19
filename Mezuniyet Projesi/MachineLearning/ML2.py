import pandas as pd

data=pd.read_csv("lisans_data.csv",encoding="unicode_escape")

data.describe()
data.info()

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
    
# 1. Bölümler Arası Popülerlik
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
# 2. Son ve İlk Öğrencilerin Puan Farkı
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
# 4. Bölümlerdeki Öğrencilerin Ortalama Sıralaması
data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2
# 6. Bölümün Yıllara Göre Kapasite Değişimi
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
# 7. Bölümün Yıllara Göre Yerleşen Öğrenci Sayısı Değişimi
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
# 8. Bölümün Puan Türüne Göre Popülerliği
data['SCORE_TYPE_POPULARITY'] = data.groupby(['DEPARTMENT_ID', 'SCORE_TYPE_ID'])['FIELD_RATE'].transform('mean')
# 9. Bölümün Burs Türüne Göre Popülerliği
data['SCHOLARSHIP_POPULARITY'] = data.groupby(['DEPARTMENT_ID', 'SCHOLARSHIP_TYPE_ID'])['FIELD_RATE'].transform('mean')

# 10. Bölümün Üniversiteye Göre Popülerliği
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'DEPARTMENT_ID'])['FIELD_RATE'].transform('mean')

# Önceki yıla göre doluluk oranı değişimi
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change()

# Önceki yıla göre bölüm popülerliği değişimi
#data['POPULARITY_CHANGE'] = data.groupby('DEPARTMENT_ID')['DEPARTMENT_POPULARITY'].pct_change() 0 oluyor hep

# Ortalama puan farkı
data['AVERAGE_SCORE_DIFF'] = (data['FIRST_SCORE'] - data['LAST_SCORE']) / data['FIRST_SCORE']
column_nan_count=data.isnull().sum() # capacity_change_rate ve enrollment_change_rate değerlerinin null olması
data=data.dropna() #bu kısımda capacity ve enrollment change rate değerlerinin ilk verileri her türlü nan olacak normal yani

data['CAPACITY_TREND'] = data['CAPACITY_CHANGE_RATE'].apply(lambda x: 1 if x > 0 else 0)
drop_columns = ['DEPARTMENT_ID', 'UNIVERSITY_ID', 'SCORE_TYPE_ID', 'SCHOLARSHIP_TYPE_ID',"FACULTY_NAME","DEPARTMENT_NAME"]
data = data.drop(columns=drop_columns)


from sklearn.model_selection import train_test_split, StratifiedGroupKFold, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X = data.drop(columns=['CAPACITY_TREND'])  # Bağımsız değişkenler
y = data['CAPACITY_TREND']  # Hedef değişken

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("X_train",len(X_train))
print("X_test",len(X_test))
print("y_train",len(y_train))
print("y_test",len(y_test))

logreg=LogisticRegression()
logreg.fit(X_train,y_train)
acc_log_train=round(logreg.score(X_train,y_train)*100,2)
acc_log_test=round(logreg.score(X_test,y_test)*100,2)
print("Training accuracy: %{}".format(acc_log_train))
print("Testing accuracy: %{}".format(acc_log_test))


























