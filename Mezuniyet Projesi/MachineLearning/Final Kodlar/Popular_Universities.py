# -*- coding: utf-8 -*-
"""
Created on Tue Mar  4 20:24:49 2025

@author: emirc
"""

import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt

# Load and preprocess data
print("Loading data...")
data = pd.read_csv("lisans_data.csv", encoding="unicode_escape")

# Print column names to verify
print("\nAvailable columns in the dataset:")
print(data.columns.tolist())

# Data preprocessing
def preprocess_university_data(data):
    """
    Preprocess the data for university analysis
    """
    # Verify required columns exist
    required_columns = ['UNIVERSITY_ID', 'YEAR_ID', 'LAST_SCORE', 'FIRST_SCORE', 
                       'LAST_RANK', 'FIRST_RANK', 'GENERAL_ENROLLMENT', 'SUM_CAPACITY', 
                       'SUM_ENROLLMENT', 'FIELD_RATE']
    
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
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

def analyze_universities(data):
    """
    Analyze universities focusing on ranks, scores, and enrollment metrics
    """
    # Calculate year-over-year changes
    data = data.sort_values(['UNIVERSITY_ID', 'YEAR_ID'])
    
    # Calculate changes for each university
    change_columns = {}
    for col in ['LAST_RANK', 'FIRST_RANK', 'LAST_SCORE', 'FIRST_SCORE']:
        change_col = f'{col}_CHANGE'
        data[change_col] = data.groupby(['UNIVERSITY_ID', 'DEPARTMENT_ID'])[col].pct_change()
        change_columns[col] = change_col
    
    # Calculate capacity and enrollment changes
    data['CAPACITY_CHANGE'] = data.groupby(['UNIVERSITY_ID', 'DEPARTMENT_ID'])['SUM_CAPACITY'].pct_change()
    data['ENROLLMENT_CHANGE'] = data.groupby(['UNIVERSITY_ID', 'DEPARTMENT_ID'])['SUM_ENROLLMENT'].pct_change()

    # Calculate university-level metrics
    metrics_agg = {
        'LAST_RANK': ['mean', 'min', 'max', 'std'],
        'FIRST_RANK': ['mean', 'min', 'max', 'std'],
        'LAST_SCORE': ['mean', 'min', 'max', 'std'],
        'FIRST_SCORE': ['mean', 'min', 'max', 'std'],
        'SUM_CAPACITY': ['sum', 'mean'],
        'SUM_ENROLLMENT': ['sum', 'mean'],
        'FIELD_RATE': ['mean'],
        'DEPARTMENT_ID': 'count'  # Number of departments
    }
    
    # Add change metrics
    for change_col in change_columns.values():
        metrics_agg[change_col] = ['mean']
    metrics_agg['CAPACITY_CHANGE'] = ['mean']
    metrics_agg['ENROLLMENT_CHANGE'] = ['mean']
    
    # Calculate metrics using only UNIVERSITY_ID
    basic_metrics = data.groupby('UNIVERSITY_ID').agg(metrics_agg).round(2)
    
    # Flatten column names
    basic_metrics.columns = ['_'.join(col).strip() for col in basic_metrics.columns.values]
    
    # Calculate additional metrics
    univ_metrics = pd.DataFrame(index=basic_metrics.index)
    
    # Transfer basic metrics
    for col in basic_metrics.columns:
        univ_metrics[col] = basic_metrics[col]
    
    # Calculate derived metrics
    univ_metrics['RANK_RANGE'] = univ_metrics['LAST_RANK_mean'] - univ_metrics['FIRST_RANK_mean']
    univ_metrics['SCORE_RANGE'] = univ_metrics['FIRST_SCORE_mean'] - univ_metrics['LAST_SCORE_mean']
    univ_metrics['RANK_VOLATILITY'] = (univ_metrics['LAST_RANK_std'] + univ_metrics['FIRST_RANK_std']) / 2
    univ_metrics['SCORE_VOLATILITY'] = (univ_metrics['LAST_SCORE_std'] + univ_metrics['FIRST_SCORE_std']) / 2
    univ_metrics['ENROLLMENT_EFFICIENCY'] = (univ_metrics['SUM_ENROLLMENT_sum'] / univ_metrics['SUM_CAPACITY_sum']).round(2)
    univ_metrics['DEPARTMENT_COUNT'] = univ_metrics['DEPARTMENT_ID_count']
    
    return univ_metrics

def analyze_university_trends(data):
    """
    Analyze university trends over time
    """
    # Calculate year-over-year changes
    data = data.sort_values(['UNIVERSITY_ID', 'YEAR_ID'])
    
    # Calculate base metrics using only UNIVERSITY_ID
    yearly_trends = data.groupby(['UNIVERSITY_ID', 'YEAR_ID']).agg({
        'LAST_RANK': 'mean',
        'FIRST_RANK': 'mean',
        'LAST_SCORE': 'mean',
        'FIRST_SCORE': 'mean',
        'SUM_CAPACITY': 'sum',
        'SUM_ENROLLMENT': 'sum',
        'FIELD_RATE': 'mean',
        'DEPARTMENT_ID': 'count'
    }).round(2)
    
    # Calculate year-over-year changes
    yearly_changes = yearly_trends.groupby('UNIVERSITY_ID').pct_change()
    
    # Add changes to trends
    yearly_trends['RANK_CHANGE'] = yearly_changes['LAST_RANK']
    yearly_trends['SCORE_CHANGE'] = yearly_changes['LAST_SCORE']
    yearly_trends['ENROLLMENT_CHANGE'] = yearly_changes['SUM_ENROLLMENT']
    yearly_trends['CAPACITY_CHANGE'] = yearly_changes['SUM_CAPACITY']
    yearly_trends['DEPARTMENT_CHANGE'] = yearly_changes['DEPARTMENT_ID']
    
    return yearly_trends

def find_top_universities(univ_metrics, criteria, n=10, ascending=True):
    """
    Find top universities based on various criteria
    """
    criteria_mapping = {
        'highest_rank': ('FIRST_RANK_mean', True),  # Lower rank is better
        'lowest_rank': ('LAST_RANK_mean', False),   # Higher rank is worse
        'highest_score': ('FIRST_SCORE_mean', False),
        'rank_improvement': ('LAST_RANK_CHANGE_mean', True),
        'score_improvement': ('LAST_SCORE_CHANGE_mean', False),
        'rank_stability': ('RANK_VOLATILITY', True),
        'enrollment_growth': ('ENROLLMENT_CHANGE_mean', False),
        'capacity_utilization': ('ENROLLMENT_EFFICIENCY', False),
        'largest': ('DEPARTMENT_COUNT', False),
        'most_selective': ('SCORE_RANGE', False)
    }
    
    if criteria in criteria_mapping:
        column, asc = criteria_mapping[criteria]
        if column in univ_metrics.columns:
            return univ_metrics.sort_values(column, ascending=asc).head(n)
        else:
            print(f"Warning: Column {column} not found in metrics")
            return None
    return None

def plot_university_analysis(yearly_trends, univ_ids, title="University Analysis"):
    """
    Create visualizations for university analysis
    """
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 12))
    fig.suptitle(title, fontsize=16)
    
    for univ_id in univ_ids:
        univ_data = yearly_trends.xs(univ_id, level='UNIVERSITY_ID')
        years = univ_data.index.get_level_values('YEAR_ID')
        
        # Average Rank Trend
        ax1.plot(years, univ_data['FIRST_RANK'], marker='o', label=f"University {univ_id}")
        ax1.set_title('Average First Rank Trends')
        ax1.set_ylabel('Average First Rank')
        ax1.grid(True)
        
        # Average Score Trend
        ax2.plot(years, univ_data['FIRST_SCORE'], marker='o', label=f"University {univ_id}")
        ax2.set_title('Average First Score Trends')
        ax2.set_ylabel('Average First Score')
        ax2.grid(True)
        
        # Total Enrollment Trend
        ax3.plot(years, univ_data['SUM_ENROLLMENT'], marker='o', label=f"University {univ_id}")
        ax3.set_title('Total Enrollment Trends')
        ax3.set_ylabel('Total Enrollment')
        ax3.grid(True)
        
        # Department Count Trend
        ax4.plot(years, univ_data['DEPARTMENT_ID'], marker='o', label=f"University {univ_id}")
        ax4.set_title('Number of Departments')
        ax4.set_ylabel('Department Count')
        ax4.grid(True)
    
    for ax in [ax1, ax2, ax3, ax4]:
        ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax.set_xlabel('Year')
    
    plt.tight_layout()
    plt.show()

# Main analysis execution
try:
    print("Processing university data...")
    data = preprocess_university_data(data)

    print("\nPerforming comprehensive university analysis...")
    univ_metrics = analyze_universities(data)
    yearly_trends = analyze_university_trends(data)

    # Define criteria for university rankings
    criteria_list = [
        ('highest_rank', 'Top Universities by Average First Rank'),
        ('highest_score', 'Top Universities by Average First Score'),
        ('rank_improvement', 'Most Improved Universities (Rank)'),
        ('score_improvement', 'Most Improved Universities (Score)'),
        ('largest', 'Largest Universities by Department Count'),
        ('most_selective', 'Most Selective Universities'),
        ('enrollment_growth', 'Fastest Growing Universities'),
        ('capacity_utilization', 'Best Capacity Utilization')
    ]

    # Display rankings
    print("\nUniversity Rankings:")
    for criteria, title in criteria_list:
        print(f"\n{title}:")
        result = find_top_universities(univ_metrics, criteria, n=5)
        if result is not None:
            try:
                display_columns = [
                    'FIRST_RANK_mean', 'FIRST_SCORE_mean',
                    'DEPARTMENT_COUNT', 'ENROLLMENT_EFFICIENCY',
                    'RANK_VOLATILITY', 'SCORE_RANGE'
                ]
                print(result[display_columns])
            except KeyError as e:
                print(f"Error displaying columns: {e}")
                print("Available columns:", result.columns.tolist())

    # Plot analyses for top universities
    print("\nPlotting analysis for top ranked universities...")
    top_ranked_univs = find_top_universities(univ_metrics, 'highest_rank', n=5).index.get_level_values('UNIVERSITY_ID')
    plot_university_analysis(yearly_trends, top_ranked_univs, "Top Ranked Universities Analysis")

    print("\nPlotting analysis for most improved universities...")
    most_improved_univs = find_top_universities(univ_metrics, 'rank_improvement', n=5).index.get_level_values('UNIVERSITY_ID')
    plot_university_analysis(yearly_trends, most_improved_univs, "Most Improved Universities Analysis")

    # Save results
    univ_metrics.to_csv('university_detailed_analysis.csv')
    yearly_trends.to_csv('university_yearly_trends.csv')

    print("\nDetailed analysis results have been saved to:")
    print("- university_detailed_analysis.csv (Overall university metrics)")
    print("- university_yearly_trends.csv (Year-by-year trends)")

    # Display summary statistics
    print("\nSummary Statistics:")
    summary_stats = univ_metrics[[
        'FIRST_RANK_mean', 'FIRST_SCORE_mean',
        'DEPARTMENT_COUNT', 'ENROLLMENT_EFFICIENCY',
        'RANK_VOLATILITY', 'SCORE_RANGE'
    ]].describe()
    print(summary_stats)

except KeyError as e:
    print(f"Error: Column not found - {e}")
    print("Available columns:", data.columns.tolist())
except Exception as e:
    print(f"Error: {str(e)}")

