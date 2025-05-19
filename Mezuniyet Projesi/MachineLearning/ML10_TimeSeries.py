import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt



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
data["YEAR_ID"] = data["YEAR_ID"].apply(lambda x: 2020 + (x - 20) if 20 <= x <= 24 else x)

# Convert YEAR_ID to datetime
data['YEAR_ID'] = pd.to_datetime(data['YEAR_ID'], format='%Y')

columns=["GENERAL_CAPACITY","GENERAL_ENROLLMENT","SUM_CAPACITY","SUM_ENROLLMENT","FIELD_RATE",
         "LAST_SCORE","LAST_RANK","FIRST_SCORE","FIRST_RANK","DEPARTMENT_POPULARITY","SCORE_DIFFERENCE",
         "AVERAGE_FIELD_RATE","CAPACITY_CHANGE_RATE","ENROLLMENT_CHANGE_RATE","UNIVERSITY_POPULARITY",
         "FIELD_RATE_CHANGE","LAST_RANK_CHANGE","FIRST_RANK_CHANGE"]

# Group data by DEPARTMENT_ID and fit Prophet models
grouped_data = data.groupby('DEPARTMENT_ID')


# Prophet modeli ile tahmin yapma
forecasts = {}  # Nested dictionary

for department_id, group in grouped_data:
    if len(group) < 3:  # Yeterli verisi olmayan bölümleri atla
        print(f"Skipping Department {department_id} due to insufficient data.")
        continue

    forecasts[department_id] = {}  # Bölüm için bir alt sözlük oluştur

    for col in columns:
        if col not in group.columns:
            continue  # Eğer sütun eksikse geç

        prophet_data = group[['YEAR_ID', col]].rename(columns={'YEAR_ID': 'ds', col: 'y'})

        if prophet_data['y'].isnull().sum() > 0:
            print(f"Skipping {col} for Department {department_id} due to missing values.")
            continue

        model = Prophet()
        model.fit(prophet_data)

        future = model.make_future_dataframe(periods=1, freq='YE')  # 1 yıl tahmin et
        forecast = model.predict(future)

        forecasts[department_id][col] = forecast  # Tahmini ilgili bölüme ekle

        #model.plot(forecast, uncertainty=True)
        #plt.title(f'Department {department_id} - {col} Forecast')
        #plt.show()

# Tahmin sonuçlarını kaydetmek için boş bir liste oluştur
forecast_list = []

# Her bölüm için tahminleri bir listeye ekleyerek sakla
for department_id, forecasts_dict in forecasts.items():
    for col, forecast in forecasts_dict.items():
        forecast['DEPARTMENT_ID'] = department_id
        forecast['METRIC'] = col
        forecast_list.append(forecast[['ds', 'DEPARTMENT_ID', 'METRIC', 'yhat', 'yhat_lower', 'yhat_upper']])

# Tüm tahminleri tek bir DataFrame'e birleştir
forecast_df = pd.concat(forecast_list, ignore_index=True)

# CSV olarak kaydet
forecast_df.to_csv("forecast_results.csv", index=False, encoding="utf-8")

print("Tahmin sonuçları 'forecast_results.csv' dosyasına kaydedildi.")
        












