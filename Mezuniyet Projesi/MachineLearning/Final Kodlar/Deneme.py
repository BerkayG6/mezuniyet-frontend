import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import RandomizedSearchCV, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_and_preprocess_data():
    """
    Load and preprocess the data for analysis
    """
    logger.info("Loading data...")
    data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")
    
    # Convert score columns
    data['LAST_SCORE'] = data['LAST_SCORE'].str.replace(',','.').astype(float)
    data['FIRST_SCORE'] = data['FIRST_SCORE'].str.replace(',','.').astype(float)
    
    # Remove invalid entries
    data = data[data["GENERAL_ENROLLMENT"]!=-6]
    data = data[data["GENERAL_ENROLLMENT"]!=-1]
    data = data[data["LAST_SCORE"]!=-2]
    data = data[data["LAST_SCORE"]!=-1]
    
    # Clip field rate to valid range
    data['FIELD_RATE'] = data['FIELD_RATE'].clip(upper=1)
    
    return data

def create_features(data):
    """
    Create additional features for the model with enhanced metrics
    """
    logger.info("Creating features...")
    
    # Basic popularity metrics
    data['DEPARTMENT_POPULARITY'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].transform('mean') / \
                                   data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].transform('mean')
    data['DEPARTMENT_POPULARITY'] = data['DEPARTMENT_POPULARITY'].clip(upper=1)
    
    # Score-based features
    data['SCORE_DIFFERENCE'] = data['FIRST_SCORE'] - data['LAST_SCORE']
    data['SCORE_RANGE_RATIO'] = data['SCORE_DIFFERENCE'] / data['FIRST_SCORE']
    data['SCORE_STABILITY'] = data.groupby('DEPARTMENT_ID')['SCORE_DIFFERENCE'].transform('std')
    
    # Rank-based features
    data['RANK_RANGE'] = data['LAST_RANK'] - data['FIRST_RANK']
    data['RANK_RANGE_RATIO'] = data['RANK_RANGE'] / data['FIRST_RANK']
    data['RANK_STABILITY'] = data.groupby('DEPARTMENT_ID')['RANK_RANGE'].transform('std')
    
    # Field rate metrics
    data['AVERAGE_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('mean')
    data['FIELD_RATE_STABILITY'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform('std')
    data['FIELD_RATE_TREND'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform(lambda x: x.pct_change().mean())
    
    # Sort by department and year for time-based features
    data.sort_values(by=['DEPARTMENT_ID', 'YEAR_ID'], inplace=True)
    
    # Year-over-year changes
    data['CAPACITY_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
    data['ENROLLMENT_CHANGE_RATE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()
    
    # University-level metrics
    data['UNIVERSITY_POPULARITY'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['AVERAGE_FIELD_RATE'].transform('mean')
    data['UNIVERSITY_SCORE_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_SCORE'].transform('mean')
    data['UNIVERSITY_RANK_AVG'] = data.groupby(['UNIVERSITY_ID', 'YEAR_ID'])['FIRST_RANK'].transform('mean')
    
    # Department-specific trends
    data['FIELD_RATE_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].pct_change()
    data['LAST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['LAST_RANK'].pct_change()
    data['FIRST_RANK_CHANGE'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].pct_change()
    
    # Rolling metrics (3-year window)
    data['ROLLING_FIELD_RATE'] = data.groupby('DEPARTMENT_ID')['FIELD_RATE'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean())
    data['ROLLING_SCORE_DIFF'] = data.groupby('DEPARTMENT_ID')['SCORE_DIFFERENCE'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean())
    data['ROLLING_RANK_RANGE'] = data.groupby('DEPARTMENT_ID')['RANK_RANGE'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean())
    
    # Efficiency metrics
    data['ENROLLMENT_EFFICIENCY'] = data['SUM_ENROLLMENT'] / data['SUM_CAPACITY']
    data['SCORE_EFFICIENCY'] = data['FIRST_SCORE'] / data['LAST_RANK']
    data['RANK_EFFICIENCY'] = data['FIRST_RANK'] / data['LAST_RANK']
    
    # Trend indicators
    data['SCORE_TREND'] = data.groupby('DEPARTMENT_ID')['FIRST_SCORE'].transform(
        lambda x: x.pct_change().rolling(window=3, min_periods=1).mean())
    data['RANK_TREND'] = data.groupby('DEPARTMENT_ID')['FIRST_RANK'].transform(
        lambda x: x.pct_change().rolling(window=3, min_periods=1).mean())
    
    # Competition metrics
    data['COMPETITION_LEVEL'] = data['SCORE_DIFFERENCE'] * data['FIELD_RATE']
    data['SELECTIVITY'] = data['FIRST_SCORE'] * (1 - data['FIELD_RATE'])
    
    # Year-based features
    data['YEAR_TREND'] = data['YEAR_ID'] - data['YEAR_ID'].min()
    data['IS_RECENT'] = (data['YEAR_ID'] == data['YEAR_ID'].max()).astype(int)
    
    # Remove any remaining NaN values
    data = data.dropna()
    
    return data

def prepare_data(data):
    """
    Prepare data for modeling by splitting into training and 2024 data
    """
    logger.info("Preparing data for modeling...")
    
    # Split 2024 data
    data_24 = data[data["YEAR_ID"]==24].copy()
    data = data[data.YEAR_ID !=24].copy()
    
    # Set index and drop unnecessary columns
    data = data.set_index('DEPARTMENT_ID')
    data_24 = data_24.set_index('DEPARTMENT_ID')
    
    drop_columns = ['UNIVERSITY_ID', "FACULTY_NAME", "DEPARTMENT_NAME",
                   "SCHOLARSHIP_TYPE_ID", "SCORE_TYPE_ID", "YEAR_ID"]
    data = data.drop(columns=drop_columns)
    data_24 = data_24.drop(columns=drop_columns)
    
    return data, data_24



def train_and_evaluate_model(data, data_24, target_columns):
    """
    Train and evaluate the model for each target column with enhanced metrics
    """
    logger.info("Training and evaluating models...")
    scaler = StandardScaler()
    results = pd.DataFrame()
    
    for target in target_columns:
        logger.info(f"Training model for {target}")
        
        # Prepare features and target
        X = data.drop(columns=[target])
        y = data[target]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Transform target (log transformation)
        y_train_transformed = np.log1p(y_train)
        y_test_transformed = np.log1p(y_test)
        
        # Initialize and train model with enhanced parameters
        model = XGBRegressor(
            colsample_bytree=0.8,
            learning_rate=0.01,
            max_depth=6,
            n_estimators=1000,
            subsample=0.8,
            min_child_weight=1,
            gamma=0.1,
            reg_alpha=0.1,
            reg_lambda=1,
            random_state=42
        )
        
        model.fit(X_train_scaled, y_train_transformed)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        y_train_pred = model.predict(X_train_scaled)
        
        # Calculate comprehensive metrics
        mae = mean_absolute_error(y_test_transformed, y_pred)
        r2 = r2_score(y_test_transformed, y_pred)
        mae_train = mean_absolute_error(y_train_transformed, y_train_pred)
        r2_train = r2_score(y_train_transformed, y_train_pred)
        
        # Transform predictions back
        y_pred = np.expm1(y_pred)
        
        # Log detailed results
        logger.info(f"\nDetailed Results for {target}:")
        logger.info(f"Model Performance:")
        logger.info(f"- R² Score - Train: {r2_train:.4f}, Test: {r2:.4f}")
        logger.info(f"- MAE - Train: {mae_train:.4f}, Test: {mae:.4f}")
        logger.info(f"- Overfitting Check - Train MAE: {mae_train:.4f}, Test MAE: {mae:.4f}")
        
        # Feature importance analysis
        feature_importance = pd.DataFrame({
            'Feature': X.columns,
            'Importance': model.feature_importances_
        }).sort_values('Importance', ascending=False)
        
        logger.info("\nTop 10 Most Important Features:")
        for idx, row in feature_importance.head(10).iterrows():
            logger.info(f"- {row['Feature']}: {row['Importance']:.4f}")
        
        # Predict 2024 data
        X_24 = data_24.drop(columns=[target])
        y_24 = data_24[target]
        X_24_scaled = scaler.transform(X_24)
        pred_24 = model.predict(X_24_scaled)
        pred_24 = np.expm1(pred_24)
        
        r2_24 = r2_score(y_24, pred_24)
        mae_24 = mean_absolute_error(y_24, pred_24)
        
        logger.info(f"\n2024 Prediction Performance:")
        logger.info(f"- R² Score: {r2_24:.4f}")
        logger.info(f"- MAE: {mae_24:.4f}")
        
        # Store results
        results[target] = y_24
        results[f"Predicted_{target}"] = pred_24
        
        # Plot feature importance
        plot_feature_importance(model, X.columns)
    
    # Calculate mean values and additional metrics
    results["Mean_Actual"] = (results["LAST_RANK"] + results["FIRST_RANK"]) / 2
    results["Mean_Predicted"] = (results["Predicted_LAST_RANK"] + results["Predicted_FIRST_RANK"]) / 2
    results["Prediction_Error"] = abs(results["Mean_Actual"] - results["Mean_Predicted"])
    results["Prediction_Error_Pct"] = (results["Prediction_Error"] / results["Mean_Actual"]) * 100
    
    return results

def plot_feature_importance(model, feature_names):
    """
    Plot feature importance
    """
    importances = model.feature_importances_
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)
    
    plt.figure(figsize=(12, 6))
    sns.barplot(x=feature_importance_df['Importance'], y=feature_importance_df['Feature'])
    plt.title("Feature Importance in XGBoost Model")
    plt.tight_layout()
    plt.show()

def main():
    """
    Main execution function
    """
    try:
        # Load and preprocess data
        data = load_and_preprocess_data()
        
        # Create features
        data = create_features(data)
        
        # Prepare data for modeling
        data, data_24 = prepare_data(data)
        
        # Train and evaluate models
        target_columns = ["LAST_RANK", "FIRST_RANK"]
        results = train_and_evaluate_model(data, data_24, target_columns)
        
        # Save results
        results.to_csv('rank_predictions_2024.csv')
        logger.info("Results saved to rank_predictions_2024.csv")
        
        # Display correlation matrix
        plt.figure(figsize=(12, 10))
        sns.heatmap(data.corr(), cmap="coolwarm", annot=True)
        plt.title("Feature Correlation Matrix")
        plt.tight_layout()
        plt.show()
        
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    main()