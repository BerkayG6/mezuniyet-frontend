import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import logging
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_and_preprocess_data():
    """
    Load and preprocess the data for department analysis
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

def group_similar_departments(data, similarity_threshold=80):
    """
    Group similar department names using fuzzy string matching
    """
    logger.info("Grouping similar departments...")
    
    # Get unique department names
    dept_names = data['DEPARTMENT_NAME'].unique()
    
    # Create dictionary to store department groups
    dept_groups = {}
    processed = set()
    
    for dept in dept_names:
        if dept not in processed:
            # Find similar departments
            similar_depts = [dept]
            processed.add(dept)
            
            for other_dept in dept_names:
                if other_dept not in processed:
                    # Calculate similarity ratio
                    similarity = fuzz.ratio(dept.lower(), other_dept.lower())
                    if similarity >= similarity_threshold:
                        similar_depts.append(other_dept)
                        processed.add(other_dept)
            
            # Create group name from the most common words
            group_name = max(similar_depts, key=len)
            dept_groups[group_name] = similar_depts
    
    # Create mapping dictionary
    dept_mapping = {dept: group for group, depts in dept_groups.items() for dept in depts}
    
    # Add grouped department names to dataframe
    data['DEPARTMENT_GROUP'] = data['DEPARTMENT_NAME'].map(dept_mapping)
    
    return data, dept_groups

def calculate_department_metrics(data):
    """
    Calculate various metrics for department analysis
    """
    logger.info("Calculating department metrics...")
    
    # Group by department and year
    dept_metrics = data.groupby(['DEPARTMENT_GROUP', 'YEAR_ID']).agg({
        'FIRST_RANK': ['mean', 'min'],
        'LAST_RANK': ['mean', 'max'],
        'FIRST_SCORE': ['mean', 'min'],
        'LAST_SCORE': ['mean', 'max'],
        'FIELD_RATE': 'mean',
        'SUM_CAPACITY': 'sum',
        'SUM_ENROLLMENT': 'sum',
        'DEPARTMENT_ID': 'count'
    }).round(2)
    
    # Flatten column names
    dept_metrics.columns = ['_'.join(col).strip() for col in dept_metrics.columns.values]
    
    # Calculate additional metrics
    dept_metrics['SCORE_RANGE'] = dept_metrics['FIRST_SCORE_mean'] - dept_metrics['LAST_SCORE_mean']
    dept_metrics['RANK_RANGE'] = dept_metrics['LAST_RANK_mean'] - dept_metrics['FIRST_RANK_mean']
    dept_metrics['ENROLLMENT_RATE'] = (dept_metrics['SUM_ENROLLMENT_sum'] / dept_metrics['SUM_CAPACITY_sum']).clip(upper=1)
    
    # Calculate year-over-year changes
    dept_metrics = dept_metrics.reset_index()
    dept_metrics['RANK_CHANGE'] = dept_metrics.groupby('DEPARTMENT_GROUP')['FIRST_RANK_mean'].pct_change()
    dept_metrics['SCORE_CHANGE'] = dept_metrics.groupby('DEPARTMENT_GROUP')['FIRST_SCORE_mean'].pct_change()
    dept_metrics['POPULARITY_CHANGE'] = dept_metrics.groupby('DEPARTMENT_GROUP')['FIELD_RATE_mean'].pct_change()
    
    return dept_metrics

def analyze_department_trends(dept_metrics):
    """
    Analyze trends in department popularity and performance
    """
    logger.info("Analyzing department trends...")
    
    # Calculate overall trends
    trends = dept_metrics.groupby('DEPARTMENT_GROUP').agg({
        'RANK_CHANGE': 'mean',
        'SCORE_CHANGE': 'mean',
        'POPULARITY_CHANGE': 'mean',
        'FIELD_RATE_mean': 'mean',
        'FIRST_RANK_mean': 'mean',
        'FIRST_SCORE_mean': 'mean',
        'DEPARTMENT_ID_count': 'mean'
    }).round(4)
    
    # Categorize departments
    trends['TREND_CATEGORY'] = pd.qcut(trends['POPULARITY_CHANGE'], q=5, 
                                     labels=['Strongly Declining', 'Declining', 
                                            'Stable', 'Growing', 'Strongly Growing'])
    
    # Sort by popularity change
    trends = trends.sort_values('POPULARITY_CHANGE', ascending=False)
    
    return trends

def predict_new_department_ranks(data, dept_metrics, trends):
    """
    Predict ranks for new departments based on similar departments
    """
    logger.info("Creating prediction model for new departments...")
    
    # Calculate university metrics
    univ_metrics = data.groupby('UNIVERSITY_ID').agg({
        'FIRST_RANK': 'mean',
        'FIRST_SCORE': 'mean',
        'FIELD_RATE': 'mean'
    }).rename(columns={
        'FIRST_RANK': 'UNIV_AVG_RANK',
        'FIRST_SCORE': 'UNIV_AVG_SCORE',
        'FIELD_RATE': 'UNIV_POPULARITY'
    })
    
    # Create prediction features
    prediction_features = pd.DataFrame()
    prediction_features['DEPT_AVG_RANK'] = trends['FIRST_RANK_mean']
    prediction_features['DEPT_POPULARITY'] = trends['FIELD_RATE_mean']
    prediction_features['DEPT_TREND'] = trends['POPULARITY_CHANGE']
    prediction_features['DEPT_STABILITY'] = dept_metrics.groupby('DEPARTMENT_GROUP')['RANK_CHANGE'].std()
    
    # Save results
    trends.to_csv('department_trends.csv')
    prediction_features.to_csv('department_predictions.csv')
    
    return prediction_features, univ_metrics

def visualize_department_trends(trends, dept_metrics):
    """
    Create visualizations for department analysis
    """
    logger.info("Creating visualizations...")
    
    # Plot 1: Top Growing Departments
    plt.figure(figsize=(15, 6))
    sns.barplot(data=trends.head(10), y=trends.head(10).index, x='POPULARITY_CHANGE')
    plt.title('Top 10 Growing Departments')
    plt.xlabel('Popularity Change Rate')
    plt.tight_layout()
    plt.savefig('top_growing_departments.png')
    plt.close()
    
    # Plot 2: Department Popularity Distribution
    plt.figure(figsize=(15, 6))
    sns.boxplot(data=dept_metrics, x='DEPARTMENT_GROUP', y='FIELD_RATE_mean')
    plt.xticks(rotation=45, ha='right')
    plt.title('Department Popularity Distribution')
    plt.tight_layout()
    plt.savefig('department_popularity_distribution.png')
    plt.close()
    
    # Plot 3: Rank vs Popularity
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=trends, x='FIRST_RANK_mean', y='FIELD_RATE_mean', 
                    hue='TREND_CATEGORY', size='DEPARTMENT_ID_count')
    plt.title('Department Rank vs Popularity')
    plt.tight_layout()
    plt.savefig('rank_vs_popularity.png')
    plt.close()

def main():
    """
    Main execution function
    """
    try:
        # Load and preprocess data
        data = load_and_preprocess_data()
        
        # Group similar departments
        data, dept_groups = group_similar_departments(data)
        
        # Calculate department metrics
        dept_metrics = calculate_department_metrics(data)
        
        # Analyze trends
        trends = analyze_department_trends(dept_metrics)
        
        # Create prediction model
        prediction_features, univ_metrics = predict_new_department_ranks(data, dept_metrics, trends)
        
        # Create visualizations
        visualize_department_trends(trends, dept_metrics)
        
        # Print summary
        logger.info("\nDepartment Analysis Summary:")
        logger.info(f"Total Department Groups: {len(trends)}")
        logger.info("\nTop 5 Growing Departments:")
        print(trends.head().to_string())
        logger.info("\nBottom 5 Declining Departments:")
        print(trends.tail().to_string())
        
        logger.info("\nResults have been saved to:")
        logger.info("- department_trends.csv")
        logger.info("- department_predictions.csv")
        logger.info("- top_growing_departments.png")
        logger.info("- department_popularity_distribution.png")
        logger.info("- rank_vs_popularity.png")
        
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    main() 