import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt

data=pd.read_csv("lisans_data.csv",encoding="unicode_escape")
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

# Create department analysis functions
def analyze_departments(data):
    """
    Enhanced analysis focusing on ranks, scores, and enrollment changes
    """
    # Calculate year-over-year changes first
    data = data.sort_values(['DEPARTMENT_ID', 'YEAR_ID'])
    
    # Calculate changes for each department
    change_columns = {}
    for col in ['LAST_RANK', 'FIRST_RANK', 'LAST_SCORE', 'FIRST_SCORE']:
        change_col = f'{col}_CHANGE'
        data[change_col] = data.groupby('DEPARTMENT_ID')[col].pct_change()
        change_columns[col] = change_col
    
    # Calculate capacity and enrollment changes
    data['CAPACITY_CHANGE'] = data.groupby('DEPARTMENT_ID')['SUM_CAPACITY'].pct_change()
    data['ENROLLMENT_CHANGE'] = data.groupby('DEPARTMENT_ID')['SUM_ENROLLMENT'].pct_change()

    # First calculate basic metrics
    metrics_agg = {
        'LAST_RANK': ['mean', 'min', 'max', 'std'],
        'FIRST_RANK': ['mean', 'min', 'max', 'std'],
        'LAST_SCORE': ['mean', 'min', 'max', 'std'],
        'FIRST_SCORE': ['mean', 'min', 'max', 'std'],
        'SUM_CAPACITY': ['mean', 'min', 'max'],
        'SUM_ENROLLMENT': ['mean', 'min', 'max'],
        'FIELD_RATE': ['mean', 'min', 'max']
    }
    
    # Add change metrics to aggregation
    for change_col in change_columns.values():
        metrics_agg[change_col] = ['mean']
    metrics_agg['CAPACITY_CHANGE'] = ['mean']
    metrics_agg['ENROLLMENT_CHANGE'] = ['mean']
    
    # Calculate all metrics
    basic_metrics = data.groupby(['DEPARTMENT_ID', 'DEPARTMENT_NAME']).agg(metrics_agg).round(2)

    # Flatten column names
    basic_metrics.columns = ['_'.join(col).strip() for col in basic_metrics.columns.values]
    
    # Calculate additional metrics
    dept_metrics = pd.DataFrame(index=basic_metrics.index)
    
    # Transfer basic metrics
    for col in basic_metrics.columns:
        dept_metrics[col] = basic_metrics[col]
    
    # Calculate derived metrics
    dept_metrics['RANK_RANGE'] = dept_metrics['LAST_RANK_mean'] - dept_metrics['FIRST_RANK_mean']
    dept_metrics['SCORE_RANGE'] = dept_metrics['FIRST_SCORE_mean'] - dept_metrics['LAST_SCORE_mean']
    dept_metrics['RANK_VOLATILITY'] = (dept_metrics['LAST_RANK_std'] + dept_metrics['FIRST_RANK_std']) / 2
    dept_metrics['SCORE_VOLATILITY'] = (dept_metrics['LAST_SCORE_std'] + dept_metrics['FIRST_SCORE_std']) / 2
    dept_metrics['ENROLLMENT_EFFICIENCY'] = (dept_metrics['SUM_ENROLLMENT_mean'] / dept_metrics['SUM_CAPACITY_mean']).round(2)
    
    return dept_metrics

def analyze_department_trends(data):
    """
    Enhanced trend analysis with focus on ranks and scores
    """
    # Calculate year-over-year changes
    data = data.sort_values(['DEPARTMENT_ID', 'YEAR_ID'])
    
    # Calculate base metrics
    yearly_trends = data.groupby(['DEPARTMENT_ID', 'DEPARTMENT_NAME', 'YEAR_ID']).agg({
        'LAST_RANK': 'mean',
        'FIRST_RANK': 'mean',
        'LAST_SCORE': 'mean',
        'FIRST_SCORE': 'mean',
        'SUM_CAPACITY': 'mean',
        'SUM_ENROLLMENT': 'mean',
        'FIELD_RATE': 'mean'
    }).round(2)
    
    # Calculate year-over-year changes
    yearly_changes = yearly_trends.groupby(['DEPARTMENT_ID', 'DEPARTMENT_NAME']).pct_change()
    
    # Add changes to trends
    yearly_trends['RANK_CHANGE'] = yearly_changes['LAST_RANK']
    yearly_trends['SCORE_CHANGE'] = yearly_changes['LAST_SCORE']
    yearly_trends['ENROLLMENT_CHANGE'] = yearly_changes['SUM_ENROLLMENT']
    yearly_trends['CAPACITY_CHANGE'] = yearly_changes['SUM_CAPACITY']
    
    return yearly_trends

def compare_similar_departments(data):
    """
    Compare departments within the same faculty
    """
    # Group by faculty and analyze departments
    faculty_comparison = data.groupby(['FACULTY_NAME', 'DEPARTMENT_ID', 'DEPARTMENT_NAME']).agg({
        'LAST_RANK': 'mean',
        'FIRST_RANK': 'mean',
        'FIELD_RATE': 'mean',
        'SUM_ENROLLMENT': 'mean',
        'SUM_CAPACITY': 'mean'
    }).round(2)
    
    return faculty_comparison

def find_top_departments(dept_metrics, criteria, n=10, ascending=True):
    """
    Enhanced department ranking with more criteria
    """
    criteria_mapping = {
        'highest_rank': ('FIRST_RANK_mean', True),  # Lower rank is better
        'lowest_rank': ('LAST_RANK_mean', False),   # Higher rank is worse
        'highest_score': ('FIRST_SCORE_mean', False),
        'rank_improvement': ('LAST_RANK_CHANGE_mean', True),
        'score_improvement': ('LAST_SCORE_CHANGE_mean', False),
        'rank_stability': ('RANK_VOLATILITY', True),
        'enrollment_growth': ('ENROLLMENT_CHANGE_mean', False),
        'capacity_utilization': ('ENROLLMENT_EFFICIENCY', False)
    }
    
    if criteria in criteria_mapping:
        column, asc = criteria_mapping[criteria]
        if column in dept_metrics.columns:
            return dept_metrics.sort_values(column, ascending=asc).head(n)
        else:
            print(f"Warning: Column {column} not found in metrics")
            return None
    return None

# Display rankings with more detailed information
def display_department_rankings(dept_metrics, criteria_list):
    """
    Display department rankings with error handling
    """
    for criteria, title in criteria_list:
        print(f"\n{title}:")
        result = find_top_departments(dept_metrics, criteria, n=5)
        if result is not None:
            try:
                display_columns = [
                    'FIRST_RANK_mean', 'LAST_RANK_mean', 
                    'FIRST_SCORE_mean', 'LAST_SCORE_mean',
                    'ENROLLMENT_EFFICIENCY', 'RANK_VOLATILITY'
                ]
                print(result[display_columns])
            except KeyError as e:
                print(f"Error displaying columns: {e}")
                print("Available columns:", result.columns.tolist())

# Perform enhanced analysis
print("\nPerforming comprehensive department analysis...")
dept_metrics = analyze_departments(data)
yearly_trends = analyze_department_trends(data)

# Define criteria list
criteria_list = [
    ('highest_rank', 'Top Departments by Highest Rank (First Rank)'),
    ('lowest_rank', 'Departments with Highest Last Rank'),
    ('highest_score', 'Top Departments by Highest Score'),
    ('rank_improvement', 'Most Improved Departments (Rank)'),
    ('score_improvement', 'Most Improved Departments (Score)'),
    ('rank_stability', 'Most Stable Departments (Rank)'),
    ('enrollment_growth', 'Fastest Growing Departments'),
    ('capacity_utilization', 'Best Capacity Utilization')
]

# Display rankings
display_department_rankings(dept_metrics, criteria_list)

# Enhanced visualization function
def plot_department_analysis(yearly_trends, dept_ids, title="Department Analysis"):
    """
    Enhanced plot function with better visualization
    """
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 12))
    fig.suptitle(title, fontsize=16)
    
    for dept_id in dept_ids:
        dept_data = yearly_trends.xs(dept_id, level='DEPARTMENT_ID')
        dept_name = dept_data.index.get_level_values('DEPARTMENT_NAME')[0]
        years = dept_data.index.get_level_values('YEAR_ID')
        
        # First Rank Trend
        ax1.plot(years, dept_data['FIRST_RANK'], marker='o', label=dept_name)
        ax1.set_title('First Rank Trends')
        ax1.set_ylabel('First Rank')
        ax1.grid(True)
        
        # Last Rank Trend
        ax2.plot(years, dept_data['LAST_RANK'], marker='o', label=dept_name)
        ax2.set_title('Last Rank Trends')
        ax2.set_ylabel('Last Rank')
        ax2.grid(True)
        
        # Score Trends
        ax3.plot(years, dept_data['FIRST_SCORE'], marker='o', label=dept_name)
        ax3.set_title('First Score Trends')
        ax3.set_ylabel('First Score')
        ax3.grid(True)
        
        # Enrollment vs Capacity
        ax4.plot(years, dept_data['SUM_ENROLLMENT'] / dept_data['SUM_CAPACITY'], 
                marker='o', label=dept_name)
        ax4.set_title('Enrollment/Capacity Ratio')
        ax4.set_ylabel('Ratio')
        ax4.grid(True)
    
    for ax in [ax1, ax2, ax3, ax4]:
        ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax.set_xlabel('Year')
    
    plt.tight_layout()
    plt.show()

# Get top departments by different criteria
top_ranked_depts = find_top_departments(dept_metrics, 'highest_rank', n=5).index.get_level_values('DEPARTMENT_ID')
most_improved_depts = find_top_departments(dept_metrics, 'rank_improvement', n=5).index.get_level_values('DEPARTMENT_ID')

# Plot analyses
print("\nPlotting analysis for top ranked departments...")
plot_department_analysis(yearly_trends, top_ranked_depts, "Top Ranked Departments Analysis")

print("\nPlotting analysis for most improved departments...")
plot_department_analysis(yearly_trends, most_improved_depts, "Most Improved Departments Analysis")

# Save detailed analysis to CSV with more informative names
dept_metrics.to_csv('department_detailed_analysis.csv')
yearly_trends.to_csv('department_yearly_trends.csv')

print("\nDetailed analysis results have been saved to:")
print("- department_detailed_analysis.csv (Overall department metrics)")
print("- department_yearly_trends.csv (Year-by-year trends)")

# Display summary statistics
print("\nSummary Statistics:")
summary_stats = dept_metrics[[
    'FIRST_RANK_mean', 'LAST_RANK_mean',
    'FIRST_SCORE_mean', 'LAST_SCORE_mean',
    'ENROLLMENT_EFFICIENCY', 'RANK_VOLATILITY'
]].describe()
print(summary_stats)




