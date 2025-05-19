import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")

# Data cleaning and preprocessing
data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',', '.')
data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',', '.')

convert_dict = {"LAST_SCORE": float, "FIRST_SCORE": float}
data = data.astype(convert_dict)

# Drop unnecessary columns and rows
data = data.drop(columns=["SCHOOL_CAPACITY", "SCHOOL_ENROLLMENT"])
data = data[data["GENERAL_ENROLLMENT"] != -6]
data = data[data["GENERAL_ENROLLMENT"] != -1]
data = data[data["LAST_SCORE"] != -2]
data = data[data["LAST_SCORE"] != -1]

# Clip FIELD_RATE to 1
data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)

# Feature engineering
data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
data['AVERAGE_RANK'] = (data['LAST_RANK'] + data['FIRST_RANK']) / 2
data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)
data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
data['SCORE_TYPE_POPULARITY'] = data.groupby(['YEAR_ID', 'SCORE_TYPE_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change()
data['POPULARITY_CHANGE'] = data.groupby('YEAR_ID')['DEPARTMENT_POPULARITY'].pct_change()
data['AVERAGE_SCORE_DIFF'] = data["SCORE_DIFFERENCE"] / data['FIRST_SCORE']

# Drop rows with missing values
data = data.dropna()
data=data.drop(columns=["UNIVERSITY_ID","DEPARTMENT_ID","FACULTY_NAME","DEPARTMENT_NAME","SCHOLARSHIP_TYPE_ID"])

correlation_matrix = data.corr()
plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt='.2f')
plt.title("Correlation Heatmap")
plt.show()

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Define features and target
features = [
    "DEPARTMENT_POPULARITY","SCORE_DIFFERENCE","AVERAGE_RANK","AVERAGE_FIELD_RATE",
    "CAPACITY_CHANGE_RATE","SCORE_TYPE_POPULARITY","UNIVERSITY_POPULARITY","FIELD_RATE_CHANGE",
    "POPULARITY_CHANGE","AVERAGE_SCORE_DIFF"
    
]
target = 'ENROLLMENT_CHANGE_RATE'

# Prepare data
X = data[features]
y = data[target]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse}")
print(f"R^2 Score: {r2}")

# Feature importance
feature_importance = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
print("Feature Importance:")
print(feature_importance)

import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# Prepare data for LSTM
def create_dataset(X, y, time_step=1):
    Xs, ys = [], []
    for i in range(len(X) - time_step):
        Xs.append(X.iloc[i:(i + time_step)].values)
        ys.append(y.iloc[i + time_step])
    return np.array(Xs), np.array(ys)

# Normalize features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Define time steps (e.g., 3 years)
time_step = 3
X_lstm, y_lstm = create_dataset(pd.DataFrame(X_scaled), y, time_step)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_lstm, y_lstm, test_size=0.2, random_state=42)

# Build LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(time_step, len(features))))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, batch_size=32, epochs=50, validation_data=(X_test, y_test))

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse}")
print(f"R^2 Score: {r2}")


