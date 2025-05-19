import pandas as pd
import matplotlib.pyplot as plt
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ===============================
# 1. Veri Yükleme ve Ön İşleme
# ===============================
data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")
pure_data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")

# Veri kontrolü
data.info()
print(data.describe())

# Virgülleri nokta ile değiştirme ve sütunları float'a çevirme
data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',', '.')
data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',', '.')
convert_dict = {"LAST_SCORE": float, "FIRST_SCORE": float}
data = data.astype(convert_dict)

# Belirlenen kodlarla dolmayan (null) verileri belirliyoruz
data = data.drop(columns=["SCHOOL_CAPACITY", "SCHOOL_ENROLLMENT"])
data = data[data["GENERAL_ENROLLMENT"] != -6]
data = data[data["GENERAL_ENROLLMENT"] != -1]
data = data[data["LAST_SCORE"] != -2]
data = data[data["LAST_SCORE"] != -1]

# FIELD_RATE'yi 1 ile sınırla
data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

# Yeni özellikler üretme
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change()
data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()

# Null değerleri at
data = data.dropna()

# İki yıl veya daha az veriye sahip departmanları çıkarma
dept_year_counts = data.groupby("DEPARTMENT_ID")["YEAR_ID"].nunique()
low_departments = dept_year_counts[dept_year_counts <= 2].index
data = data[~data["DEPARTMENT_ID"].isin(low_departments)]

# 2024 verilerini ayır: Gelecek tahminlerinin karşılaştırılması için gerçek 2024 verileri
data_24 = data[data["YEAR_ID"] == 24].copy()

# Diğer yılları tahmin için kullanmak üzere ayırıyoruz
data = data[data.YEAR_ID != 24]

# İstenilen sütunların index olarak DEPARTMENT_ID kullanılması
data = data.set_index('DEPARTMENT_ID')
data_24 = data_24.set_index('DEPARTMENT_ID')

# YEAR_ID sütununu yıllara dönüştürme (örnek olarak 20,21,22,23 → 2020-2023)
data["YEAR_ID"] = data["YEAR_ID"].apply(lambda x: 2020 + (x - 20) if 20 <= x <= 23 else x)

# YEAR_ID'yi datetime formatına çeviriyoruz
data['YEAR_ID'] = pd.to_datetime(data['YEAR_ID'], format='%Y')

# ===============================
# 2. Prophet ile Grup Bazında Tahmin
# ===============================
# Departman bazında gruplama ve Prophet modellerini eğitme
grouped_data = data.groupby('DEPARTMENT_ID')
forecasts = {}  # Her departmanın forecast sonuçlarını saklayacağız

for department_id, group in grouped_data:
    # Yeterli veri kontrolü
    if len(group) < 3:
        print(f"Skipping Department {department_id} due to insufficient data.")
        continue
    
    # Prophet için verileri hazırlama: ds -> tarih, y -> hedef (ENROLLMENT_CHANGE_RATE)
    prophet_data = group[['YEAR_ID', 'ENROLLMENT_CHANGE_RATE']].rename(columns={'YEAR_ID': 'ds', 'ENROLLMENT_CHANGE_RATE': 'y'})
    
    # Prophet modelini oluştur ve eğit
    model = Prophet()
    model.fit(prophet_data)
    
    # Gelecek için tarih aralığı oluşturma: 1 yıllık tahmin (frekans yearly - 'YE')
    future = model.make_future_dataframe(periods=1, freq='YE')
    
    # Tahmin yapma
    forecast = model.predict(future)
    
    # Tahmin sonucunu sakla
    forecasts[department_id] = forecast
    
    # Tahmin grafiğini çizdir (isteğe bağlı)
    fig = model.plot(forecast, uncertainty=True)
    plt.title(f'Department {department_id} Enrollment Change Rate Forecast')
    plt.show()

# ===============================
# 3. 2024 Gerçek Verileriyle Karşılaştırma
# ===============================
# 2024 gerçek verilerini içeren DataFrame: data_24
# "ENROLLMENT_CHANGE_RATE" sütunu gerçek değerler
true_2024 = data_24[['ENROLLMENT_CHANGE_RATE']].rename(columns={'ENROLLMENT_CHANGE_RATE': 'true_y'})

results_list = []
for dept_id, forecast in forecasts.items():
    # Forecast DataFrame'inde 'ds' sütunundan yılı çekiyoruz
    forecast['year'] = forecast['ds'].dt.year
    # 2024 yılına ait tahmin satırını alıyoruz
    forecast_2024 = forecast[forecast['year'] == 2024]
    if forecast_2024.empty:
        print(f"Department {dept_id} için 2024 tahmini bulunamadı.")
        continue
    # Genellikle tek bir satır dönecektir; ilk değeri alıyoruz
    pred_2024 = forecast_2024['yhat'].values[0]
    
    # Gerçek değer: true_2024 DataFrame'inde departman id'si ile eşleştiriliyor
    if dept_id in true_2024.index:
        true_val = true_2024.loc[dept_id, 'true_y']
    else:
        print(f"Department {dept_id} için 2024 gerçek verisi yok.")
        continue
    
    results_list.append({
        "DEPARTMENT_ID": dept_id,
        "true_y": true_val,
        "pred_y": pred_2024
    })

results_df = pd.DataFrame(results_list).set_index("DEPARTMENT_ID")
print("Gerçek ve Tahmin Değerleri (2024):")
print(results_df)

# Hata metriklerini hesaplayalım
mae = mean_absolute_error(results_df['true_y'], results_df['pred_y'])
mse = mean_squared_error(results_df['true_y'], results_df['pred_y'])
r2 = r2_score(results_df['true_y'], results_df['pred_y'])

print(f"2024 MAE: {mae}")
print(f"2024 MSE: {mse}")
print(f"2024 R2 Score: {r2}")

# Grafiksel karşılaştırma: Gerçek vs Tahmin
results_df.sort_index(inplace=True)
results_df.plot(kind='bar', figsize=(12,6))
plt.title("Department Bazında 2024 Gerçek ve Tahmin Değerleri")
plt.ylabel("ENROLLMENT_CHANGE_RATE")
plt.show()

#Prophet ile departmanların 2024 verilerini tahmin edip gerçek değerlerle karşılaştırıyoruz