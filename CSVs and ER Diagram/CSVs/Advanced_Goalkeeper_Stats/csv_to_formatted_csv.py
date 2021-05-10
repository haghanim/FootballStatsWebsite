import pandas as pd
import numpy as np

df2 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/big5/2017_18.csv', header=1)
df3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/big5/2018_19.csv', header=1)
df4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/big5/2019_20.csv', header=1)
df5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/big5/2020_21.csv', header=1)

df_ucl_3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2018_19.csv', header=1)
df_ucl_4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2019_20.csv', header=1)
df_ucl_5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2020_21.csv', header=1)

df_uel_3 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2018_19.csv', header=1)
df_uel_4 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2019_20.csv', header=1)
df_uel_5 = pd.read_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/ucl/2020_21.csv', header=1)

# Process names - remove "\"
df2['Player'] = df2['Player'].apply(lambda x: x.split('\\')[0])
df3['Player'] = df3['Player'].apply(lambda x: x.split('\\')[0])
df4['Player'] = df4['Player'].apply(lambda x: x.split('\\')[0])
df5['Player'] = df5['Player'].apply(lambda x: x.split('\\')[0])

df_ucl_3['Player'] = df_ucl_3['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_4['Player'] = df_ucl_4['Player'].apply(lambda x: x.split('\\')[0])
df_ucl_5['Player'] = df_ucl_5['Player'].apply(lambda x: x.split('\\')[0])

df_uel_3['Player'] = df_uel_3['Player'].apply(lambda x: x.split('\\')[0])
df_uel_4['Player'] = df_uel_4['Player'].apply(lambda x: x.split('\\')[0])
df_uel_5['Player'] = df_uel_5['Player'].apply(lambda x: x.split('\\')[0])

# Add Comp for UCL and Europa
df_ucl_3['Comp'] = 'UCL'
df_ucl_4['Comp'] = 'UCL'
df_ucl_5['Comp'] = 'UCL'

df_uel_3['Comp'] = 'Europa League'
df_uel_4['Comp'] = 'Europa League'
df_uel_5['Comp'] = 'Europa League'

# Fix the team name to remove Eur
df_ucl_3['Squad'] = df_ucl_3['Squad'].apply(lambda team: ' '.join(team.split()[1:]))
df_ucl_4['Squad'] = df_ucl_4['Squad'].apply(lambda team: ' '.join(team.split()[1:]))
df_ucl_5['Squad'] = df_ucl_5['Squad'].apply(lambda team: ' '.join(team.split()[1:]))

df_uel_3['Squad'] = df_uel_3['Squad'].apply(lambda team: ' '.join(team.split()[1:]))
df_uel_4['Squad'] = df_uel_4['Squad'].apply(lambda team: ' '.join(team.split()[1:]))
df_uel_5['Squad'] = df_uel_5['Squad'].apply(lambda team: ' '.join(team.split()[1:]))

# season
df2['Season'] = 2018
df3['Season'] = 2019
df4['Season'] = 2020
df5['Season'] = 2021

df_ucl_3['Season'] = 2019
df_ucl_4['Season'] = 2020
df_ucl_5['Season'] = 2021

df_uel_3['Season'] = 2019
df_uel_4['Season'] = 2020
df_uel_5['Season'] = 2021

# Add Comp for UCL and Europa
df_ucl_3['Comp'] = 'UCL'
df_ucl_4['Comp'] = 'UCL'
df_ucl_5['Comp'] = 'UCL'

df_uel_3['Comp'] = 'Europa League'
df_uel_4['Comp'] = 'Europa League'
df_uel_5['Comp'] = 'Europa League'

# merge all dfs into master_df 
dfs = [df2, df3, df4, df5, 
df_ucl_3, df_ucl_4, df_ucl_5, 
df_uel_3, df_uel_4, df_uel_5] 

master_df = pd.concat(dfs)

# drop duplicates + 'rk' column
master_df = master_df.drop_duplicates()
drop_cols = ['Rk', 'Age', '90s', '#OPA/90', '/90', 'Matches']
master_df.drop(columns=drop_cols, inplace=True)

# rename columns
master_df.columns = ['Player', 'Nation', 'Pos', 'Squad', 'Comp', 'Born',
       'goals_allowed', 'penalties_alllowed', 'free_kicks_allowed', 'corners_allowed', 'own_goals', 'PSxG', 'PSxG_per_SoT', 'PSxG_difference',
       'long_passes_cmp', 'long_passes_attempted', 'long_pass_completion', 'passes_attempted', 'throws_attempted', 'launch_percentage', 'avg_pass_length', 'goal_kicks_attempted',
       'goal_kicks_long_percentage', 'goal_kick_len', 'crosses_attempted', 'crosses_stopped', 'stop_percentage', 'defensive_actions', 'AvgDist', 'Season']

# Season

# export master_df to csv 
master_df.to_csv(r'/Users/markhaghani/Documents/GitHub/550FinalProject/CSVs/Advanced_Goalkeeper_Stats/gk_advanced_master.csv', index=False)