import pandas as pd
import numpy as np
import logging
import joblib
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, TimeSeriesSplit, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Model Configuration
model_config = {
    'xgboost_params': {
        'colsample_bytree': 1.0,
        'learning_rate': 0.01,
        'max_depth': 5,
        'n_estimators': 600,
        'subsample': 0.6,
        'random_state': 42
    },
    'training_params': {
        'test_size': 0.2,
        'random_state': 42,
        'cv_folds': 5
    }
}

def load_and_check_data(file_path):
    """
    Load data from CSV and perform initial checks
    """
    try:
        data = pd.read_csv(file_path, encoding="unicode_escape")
        logger.info(f"Data loaded successfully with shape: {data.shape}")
        return data
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

def preprocess_data(data):
    """
    Perform data preprocessing steps
    """
    try:
        # Convert score columns
        data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',','.').astype(float)
        data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',','.').astype(float)
        
        # Remove unnecessary columns
        data = data.drop(columns=["SCHOOL_CAPACITY", "SCHOOL_ENROLLMENT"])
        
        # Filter out invalid entries
        missing_value_filters = {
            "GENERAL_ENROLLMENT": [-6, -1],
            "LAST_SCORE": [-2, -1]
        }
        
        for column, values in missing_value_filters.items():
            data = data[~data[column].isin(values)]
            
        # Clip FIELD_RATE to maximum of 1
        data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)
        
        logger.info("Data preprocessing completed successfully")
        return data
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        raise

def create_features(data):
    """
    Create new features for the model
    """
    try:
        # Department Popularity
        data['DEPARTMENT_POPULARITY'] = (data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / 
                                       data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')).clip(upper=1)
        
        # Score and Rank based features
        data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
        data['SCORE_RATE'] = data['LAST_SCORE'] / data['FIRST_SCORE']
        data['RANK_EFFICIENCY'] = data['LAST_RANK'] / data['SUM_ENROLLMENT']
        
        # Field Rate and Changes
        data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
        data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
        data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
        
        # University Popularity
        data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
        
        # Rank Changes
        data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
        data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()
        
        # Time-based features
        data['YEAR_TREND'] = data['YEAR_ID'] - data['YEAR_ID'].min()
        data['IS_RECENT'] = (data['YEAR_ID'] >= data['YEAR_ID'].max() - 1).astype(int)
        
        logger.info("Feature engineering completed successfully")
        return data
    except Exception as e:
        logger.error(f"Error in feature engineering: {str(e)}")
        raise

def prepare_data_for_modeling(data):
    """
    Prepare data for modeling by splitting into train/test and handling 2024 data
    """
    try:
        # Create copy for 2025 predictions
        data_2025 = data.copy()
        
        # Extract 2024 data for validation
        data_24 = data[data["YEAR_ID"]==24]
        data = data[data.YEAR_ID != 24]
        
        # Set index and drop unnecessary columns
        data = data.set_index('DEPARTMENT_ID')
        data_24 = data_24.set_index('DEPARTMENT_ID')
        
        drop_columns = ['UNIVERSITY_ID', "FACULTY_NAME", "DEPARTMENT_NAME",
                       "SCHOLARSHIP_TYPE_ID", "SCORE_TYPE_ID", "YEAR_ID"]
        
        data = data.drop(columns=drop_columns)
        data_24 = data_24.drop(columns=drop_columns)
        
        logger.info("Data preparation completed successfully")
        return data, data_24, data_2025
    except Exception as e:
        logger.error(f"Error in data preparation: {str(e)}")
        raise

def create_and_train_model(X_train, X_test, y_train, y_test):
    """
    Create and train the XGBoost model
    """
    try:
        # Create pipeline
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('model', XGBRegressor(**model_config['xgboost_params']))
        ])
        
        # Transform target variable
        y_train_transformed = np.log1p(y_train)
        y_test_transformed = np.log1p(y_test)
        
        # Fit pipeline
        pipeline.fit(X_train, y_train_transformed)
        
        # Make predictions
        y_pred = pipeline.predict(X_test)
        y_train_pred = pipeline.predict(X_train)
        
        # Calculate metrics
        mae = mean_absolute_error(y_test_transformed, y_pred)
        r2 = r2_score(y_test_transformed, y_pred)
        
        logger.info(f"Model training completed - MAE: {mae:.4f}, R2: {r2:.4f}")
        return pipeline, mae, r2
    except Exception as e:
        logger.error(f"Error in model training: {str(e)}")
        raise

def evaluate_predictions(y_true, y_pred, prefix=""):
    """
    Evaluate model predictions with multiple metrics
    """
    metrics = {
        f"{prefix}MAE": mean_absolute_error(y_true, y_pred),
        f"{prefix}R2": r2_score(y_true, y_pred),
        f"{prefix}RMSE": np.sqrt(mean_squared_error(y_true, y_pred))
    }
    
    for metric_name, value in metrics.items():
        logger.info(f"{metric_name}: {value:.4f}")
    
    return metrics

def plot_feature_importance(model, feature_names):
    """
    Plot feature importance from the model
    """
    importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.named_steps['model'].feature_importances_
    }).sort_values('importance', ascending=False)
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=importance, x='importance', y='feature')
    plt.title('Feature Importance')
    plt.tight_layout()
    plt.show()
    
    return importance

def predict_2025(pipeline, data_2025, department_id):
    """
    Make predictions for 2025
    """
    try:
        # Prepare data for 2025 prediction
        data_2025 = data_2025.drop(columns=['UNIVERSITY_ID', "FACULTY_NAME", "DEPARTMENT_NAME",
                                           "SCHOLARSHIP_TYPE_ID", "SCORE_TYPE_ID"])
        
        # Filter for departments with complete data
        valid_departments = data_2025[data_2025['YEAR_ID'].isin([24, 23, 22])].groupby('DEPARTMENT_ID')['YEAR_ID'].nunique()
        valid_departments = valid_departments[valid_departments == 3].index
        
        filtered_df = data_2025[data_2025['DEPARTMENT_ID'].isin(valid_departments)]
        result = filtered_df.groupby('DEPARTMENT_ID').mean(numeric_only=True).drop(columns=['YEAR_ID'])
        
        # Make prediction for specific department
        wannaPredict = result.loc[department_id].drop("LAST_RANK")
        wannaPredict = wannaPredict.values.reshape(1, -1)
        
        predicted = pipeline.predict(wannaPredict)
        predicted = np.expm1(predicted)
        
        logger.info(f"Prediction for department {department_id}: {predicted[0]:.2f}")
        return predicted[0]
    except Exception as e:
        logger.error(f"Error in 2025 prediction: {str(e)}")
        raise

def save_model(pipeline, filename_prefix):
    """
    Save the trained model and scaler
    """
    try:
        joblib.dump(pipeline, f'{filename_prefix}_pipeline.joblib')
        logger.info(f"Model saved successfully as {filename_prefix}_pipeline.joblib")
    except Exception as e:
        logger.error(f"Error saving model: {str(e)}")
        raise

def main():
    try:
        # Load data
        data = load_and_check_data("lisans_data.csv")
        pure_data = data.copy()
        
        # Preprocess data
        data = preprocess_data(data)
        
        # Create features
        data = create_features(data)
        
        # Prepare data for modeling
        data, data_24, data_2025 = prepare_data_for_modeling(data)
        
        # Split features and target
        X = data.drop(columns=['LAST_RANK'])
        y = data['LAST_RANK']
        
        # Split train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=model_config['training_params']['test_size'],
            random_state=model_config['training_params']['random_state']
        )
        
        # Train model
        pipeline, mae, r2 = create_and_train_model(X_train, X_test, y_train, y_test)
        
        # Plot feature importance
        plot_feature_importance(pipeline, X.columns)
        
        # Make 2024 predictions
        A = data_24.drop(columns=["LAST_RANK"])
        B = data_24["LAST_RANK"]
        
        predict_2024 = pipeline.predict(A)
        predict_2024 = np.expm1(predict_2024)
        r3 = r2_score(B, predict_2024)
        
        logger.info(f"2024 prediction R2 score: {r3:.4f}")
        
        # Make 2025 prediction for specific department
        department_id = 201190054
        predicted_2025 = predict_2025(pipeline, data_2025, department_id)
        
        # Save model
        save_model(pipeline, "student_rank_predictor")
        
    except Exception as e:
        logger.error(f"Error in main execution: {str(e)}")
        raise

if __name__ == "__main__":
    main() 