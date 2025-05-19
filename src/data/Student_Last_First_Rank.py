import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Veriyi okuma
data = pd.read_csv("ML_Data.csv")
data_24 = pd.read_csv("ML_Data_24.csv")
data.head()
data=data.set_index("DEPARTMENT_ID")
data_24=data_24.set_index("DEPARTMENT_ID")



scaler = StandardScaler()
lastTable = pd.DataFrame()

# Parametreler
def get_xgb_params(rank_type):
    params = {
        "LAST_RANK": {
            "colsample_bytree": 0.8,  
            "learning_rate": 0.031111111,
            "max_depth": 5,
            "n_estimators": 700,
            "subsample": 1,
            "random_state": 53,
            "reg_alpha": 0.5,
            "reg_lambda": 0.8888888888888888,
        },
        "FIRST_RANK": {
            "colsample_bytree": 0.9,
            "learning_rate": 0.03111111111111111,
            "max_depth": 7,
            "n_estimators": 900,
            "subsample": 0.8,
            "random_state": 27,
            "reg_alpha": 0.5555555555555556,
            "reg_lambda": 0.2222222222222222,
        },
    }
    return params[rank_type]


def train_and_test(data, data_24, rank_type, last_table):
    X = data.drop(columns=[rank_type])  
    y = data[rank_type]  
    params = get_xgb_params(rank_type)  
    random_state = params["random_state"]

    # Veriyi bölme
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)
    
    # Ölçeklendirme: train + data_24 birlikte fit edilmeli
    scaler.fit(pd.concat([X_train, data_24.drop(columns=[rank_type])], axis=0))
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Log dönüşümü
    y_train_transformed = np.log1p(y_train)
    y_test_transformed = np.log1p(y_test)

    # Modeli tanımlama
    best_xgb = XGBRegressor(**params)

    # Modeli eğitme
    best_xgb.fit(X_train_scaled, y_train_transformed)

    # Tahmin yapma
    y_pred = best_xgb.predict(X_test_scaled)
    y_train_pred = best_xgb.predict(X_train_scaled)

    # Hata hesaplama
    mae = mean_absolute_error(y_test_transformed, y_pred)
    r2 = r2_score(y_test_transformed, y_pred)

    # Log dönüşüm geri alma
    y_pred = np.expm1(y_pred)
    mae_ytrain_pred = mean_absolute_error(y_train_transformed, y_train_pred)
    r2_ytrain_pred = r2_score(y_train_transformed, y_train_pred)

    print(f"{rank_type} için Overfitting kontrolü -> Eğitim Hatası: {mae_ytrain_pred}, Test Hatası: {mae}, Oranı:{mae/mae_ytrain_pred}")
    print(f"{rank_type} Test Skoru: {r2}, Eğitim Skoru: {r2_ytrain_pred}")

    # 2024 verileriyle test
    A = data_24.drop(columns=[rank_type])
    B = data_24[rank_type]
    A_scaled = scaler.transform(A)
    predict = best_xgb.predict(A_scaled)
    predict = np.expm1(predict)
    r3 = r2_score(B, predict)
    print(f"{rank_type} için 2024 verileri doğruluk oranı: {r3}")

    # Sonuçları last_table'a ekle
    last_table[rank_type] = B
    last_table[f"PREDICTED_{rank_type}"] = predict

    # Öznitelik önemi
    importances = best_xgb.feature_importances_
    feature_names = X.columns
    feature_importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
    feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)
    print(feature_importance_df)

    return last_table  # Güncellenmiş tabloyu döndür


# Modeli eğit ve test et
for rank in ["LAST_RANK", "FIRST_RANK"]:
    lastTable = train_and_test(data, data_24, rank, lastTable)  # Güncellenmiş lastTable'ı al

# Ortalama hesaplama
lastTable["Mean_Actual"] = (lastTable["LAST_RANK"] + lastTable["FIRST_RANK"]) / 2
lastTable["Mean_Predicted"] = (lastTable["PREDICTED_LAST_RANK"] + lastTable["PREDICTED_FIRST_RANK"]) / 2

lastTable.to_csv("lastTable_2024.csv")