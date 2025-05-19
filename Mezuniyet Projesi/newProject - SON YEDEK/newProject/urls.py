import pandas as pd

df = pd.read_csv('Department2024.csv', delimiter=';')
print(df)
print(df.columns)
departmentID2024=[]
departmentID2024 = df['Department Id'].tolist()
print(departmentID2024)

df = pd.read_csv('Department2023.csv', delimiter=';')
print(df)
print(df.columns)
departmentID2023=[]
departmentID2023 = df['Department Id'].tolist()
print(departmentID2023)

df = pd.read_csv('Department2022.csv', delimiter=';')
print(df)
print(df.columns)
departmentID2022=[]
departmentID2022 = df['Department Id'].tolist()
print(departmentID2022)

df = pd.read_csv('Department2021.csv', delimiter=';')
print(df)
print(df.columns)
departmentID2021=[]
departmentID2021 = df['Department Id'].tolist()
print(departmentID2021)

df = pd.read_csv('Department2020.csv', delimiter=';')
print(df)
print(df.columns)
departmentID2020=[]
departmentID2020 = df['Department Id'].tolist()
print(departmentID2020)

df = pd.read_csv('Department2019.csv')
print(df)
print(df.columns)
departmentID2019=[]
departmentID2019 = df['Department Id'].tolist()
print(departmentID2019)
