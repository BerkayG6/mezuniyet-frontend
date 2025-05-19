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


data=data.drop(columns=["GENERAL_CAPACITY","GENERAL_ENROLLMENT"],axis=1) 

#iki yıl ve daha az veriye sahip olan department idleri çıkarıyorum.
#çünkü 2019da enrollment değeri 0 oluyor ve 2024de o bölümü açıyorlar enrollment 92 oluyor bu outlier değerler oluyor aslında
dept_year_counts=data.groupby("DEPARTMENT_ID")["YEAR_ID"].nunique()
low_departments=dept_year_counts[dept_year_counts<=2].index
data=data[~data["DEPARTMENT_ID"].isin(low_departments)]

data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)

#department popularity için bunlar lazım
data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()
data["SUM_LAST_RANK_CHANGE"]=data.groupby("DEPARTMENT_ID")["LAST_RANK_CHANGE"].transform("mean")
data["SUM_FIRST_RANK_CHANGE"]=data.groupby("DEPARTMENT_ID")["FIRST_RANK_CHANGE"].transform("mean")

data['UNIVERSITY_SCORE_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_SCORE'].transform('mean')
data['UNIVERSITY_RANK_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_RANK'].transform('mean')

data=data.dropna()


