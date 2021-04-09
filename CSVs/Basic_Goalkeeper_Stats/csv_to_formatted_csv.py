import pandas as pd
import numpy as np

df1 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2016_17.csv', header=1)
df2 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2017_18.csv', header=1)
df3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2018_19.csv', header=1)
df4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2019_20.csv', header=1)
df5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/big5/2020_21.csv', header=1)

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
df1['Player'] = df1['Player'].apply(lambda x: x.split('\\')[0])
df2['Player'] = df2['Player'].apply(lambda x: x.split('\\')[0])
df3['Player'] = df3['Player'].apply(lambda x: x.split('\\')[0])
df4['Player'] = df4['Player'].apply(lambda x: x.split('\\')[0])
df5['Player'] = df5['Player'].apply(lambda x: x.split('\\')[0])

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
dfs = [df1, df2, df3, df4, df5, 
df_ucl_1, df_ucl_2, df_ucl_3, df_ucl_4, df_ucl_5, 
df_uel_1, df_uel_2, df_uel_3, df_uel_4, df_uel_5] 

master_df = pd.concat(dfs)

# drop duplicates + 'rk' column
master_df = master_df.drop_duplicates()
drop_cols = ['Rk', 'Age', 'MP', 'Starts', 'Min', '90s', 'Matches']
master_df.drop(columns=drop_cols, inplace=True)

# rename columns
master_df.columns = ['Player', 'Nation', 'Pos', 'Squad', 'Comp', 'Born', 'GA', 'GA_per_90', 'SoTA', 'Saves', 'save_percentage', 'wins',
       'draws', 'losses', 'clean_sheet', 'clean_sheet_percentage', 'penalties_attempted', 'penalties_allowed', 'penalties_saved', 'penalties_missed', 'penalty_save_percentage']

print(master_df)

# export master_df to csv 
master_df.to_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Basic_Goalkeeper_Stats/gk_basic_master.csv', index=False)