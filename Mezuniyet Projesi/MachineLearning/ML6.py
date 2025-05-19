import pandas as pd

data=pd.read_csv("onlisans_data.csv",encoding="unicode_escape")
data.head()

data.info()
print(data.describe())

#veri düzenleme
data['LAST_SCORE_12'] = data['LAST_SCORE_12'].str.replace(',','.')
data['LAST_SCORE_18'] = data['LAST_SCORE_18'].str.replace(',','.')

convert_dict={"LAST_SCORE_12":float,"LAST_SCORE_18":float}
data=data.astype(convert_dict)

count_minus_one_schoolCapacity=data["SCHOOL_CAPACITY"].value_counts().get(-1,0)
count_minus_one_generalEnrollment=data["GENERAL_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_schoolEnrollment=data["SCHOOL_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_sumEnrollment=data["SUM_ENROLLMENT"].value_counts().get(-1,0)
count_minus_one_lastScore12=data["LAST_SCORE_12"].value_counts().get(-1,0)
count_minus_two_lastScore12=data["LAST_SCORE_12"].value_counts().get(-2,0)
count_minus_one_lastScore18=data["LAST_SCORE_18"].value_counts().get(-1,0)
count_minus_two_lastScore18=data["LAST_SCORE_18"].value_counts().get(-2,0)
count_minus_one_lastRank12=data["LAST_RANK_12"].value_counts().get(-1,0)
count_minus_two_lastRank12=data["LAST_RANK_12"].value_counts().get(-2,0)
count_minus_one_lastRank18=data["LAST_SCORE_18"].value_counts().get(-1,0)
count_minus_two_lastRank18=data["LAST_SCORE_18"].value_counts().get(-2,0)

data=data.drop(columns=["SCHOOL_CAPACITY","SCHOOL_ENROLLMENT"]) #capacity için school kısmı silindi - gereksiz
data=data[data["GENERAL_ENROLLMENT"]!=-1] #genel yerleşme verileri --- olan rowlar silindi
data=data[data["LAST_SCORE_12"]!=-2] #son kişinin Dolmadı verileri silindi
data=data[data["LAST_SCORE_12"]!=-1] #son kişinin --- olan verileri silindi
data=data[data["LAST_SCORE_18"]!=-2] #son kişinin Dolmadı verileri silindi
data=data[data["LAST_SCORE_18"]!=-1] #son kişinin --- olan verileri silindi























