import pandas as pd
import numpy as np

cols = ['Player', 'Nation', 'Born']
df1 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2016_17.csv')
df2 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2017_18.csv')
df3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2018_19.csv')
df4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2019_20.csv')
df5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2020_21.csv')

df_ucl_1 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2016_17.csv', header=1)
df_ucl_2 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2017_18.csv', header=1)
df_ucl_3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2018_19.csv', header=1)
df_ucl_4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2019_20.csv', header=1)
df_ucl_5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2020_21.csv', header=1)

df_uel_1 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2016_17.csv', header=1)
df_uel_2 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2017_18.csv', header=1)
df_uel_3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2018_19.csv', header=1)
df_uel_4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2019_20.csv', header=1)
df_uel_5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/ucl/2020_21.csv', header=1)

# Process names - remove "\"
df_ucl_1['Player'] = df_ucl_1['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_2['Player'] = df_ucl_2['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_3['Player'] = df_ucl_3['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_4['Player'] = df_ucl_4['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_5['Player'] = df_ucl_5['Player'].apply(lambda x: x.split('\\')[0])

df_uel_1['Player'] = df_uel_1['Player'].apply(lambda x: x.split('\\')[0])
df_uel_2['Player'] = df_uel_2['Player'].apply(lambda x: x.split('\\')[0])
df_uel_3['Player'] = df_uel_3['Player'].apply(lambda x: x.split('\\')[0])
df_uel_4['Player'] = df_uel_4['Player'].apply(lambda x: x.split('\\')[0])
df_uel_5['Player'] = df_uel_5['Player'].apply(lambda x: x.split('\\')[0])

# merge all dfs into master_df 
dfs = [df1[cols], df2[cols], df3[cols], df4[cols], df5[cols], 
df_ucl_1[cols], df_ucl_2[cols], df_ucl_3[cols], df_ucl_4[cols], df_ucl_5[cols], 
df_uel_1[cols], df_uel_2[cols], df_uel_3[cols], df_uel_4[cols], df_uel_5[cols]] 

master_df = pd.concat(dfs)
master_df = master_df.drop_duplicates()

print(master_df)

# export master_df to csv 
master_df.to_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Player_GK/master.csv', index=False)