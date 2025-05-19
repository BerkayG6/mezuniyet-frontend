import pandas as pd

df = pd.read_csv('Department.csv', delimiter=';')
print(df)
print(df.columns)

departmentID=[]
departmentID = df['Department Id'].tolist()
print(departmentID)
