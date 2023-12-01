#%%

import pandas as pd
import geopandas as gpd
from marmot.scenariohandlers import SIIPScenario
import os

bus_locs_path = os.path.normpath(r'//nrelnas01/PLEXOS CEII/Projects/NTP/04-Scenarios/PFD/20230718/MMWG_2031_Busbar_GIS_Mapping_20230718.csv') # map to bus if not in gen
#bus_locs_path = os.path.normpath(r'C:\Users\MWEBB\Downloads\Battelle_NorthAmerica_E_221\EI_2031.xlsx') # map to bus if not in gen
scenario_path = os.path.normpath(r'//nrelnas01/PLEXOS CEII/Projects/NTP/04-Scenarios/PCM/Nodal/01-Scenario/St2/MMWG_2031SUM_2021_with_TSsz_scen1_R52_par_BouLI/decomposition_results/geo_decomposition_2023-06-17/Aggregates')

#new_lines_path = os.path.normpath('') #use columns of new lines to create new linestrings
# assume the base transmission will be static

bus_locs = pd.read_csv(bus_locs_path)

bus_locs.head()

#%%
ntps_scenario = SIIPScenario(scenario_path)

flow_df = ntps_scenario.get_line_flow_data()

#%%
#gdf['LINE_ID'] = gdf["FROMNAME"].str.strip().replace("_","") + '_' + gdf["FROMNUMBER"].astype(str) + "_" + gdf["TONAME"].str.strip().replace("_","") + "_" + gdf["TONUMBER"].astype(str) + "~"+gdf["ID"].astype(str)

new_lines_path = os.path.normpath(r'//nrelnas01//PLEXOS CEII/Projects/NTP/04-Scenarios/PFD/_Scenario_01/Transmission_Expansion_20230519/S01_Transmission_Expansion_Round52.csv')

new_lines_df = pd.read_csv(new_lines_path)

new_lines_df['FromBus']=new_lines_df['FromBus'].astype(str)
new_lines_df['ToBus']=new_lines_df['ToBus'].astype(str)

new_bus_lat = new_lines_df[['FromBus','Latitude']].dropna().set_index('FromBus')['Latitude'].to_dict()
new_bus_long = new_lines_df[['FromBus', 'Longitude']].dropna().set_index('FromBus')['Longitude'].to_dict()

new_lines_df.head()
# %%
#new_lines_df = new_lines_df[new_lines_df.Type == 'BUS']

line_ids = flow_df.columns.values

line_frame = pd.DataFrame({"LINE_ID": line_ids})

line_frame.head()

# %%
line_frame['FromBus'] = line_frame['LINE_ID'].apply(lambda x: x.split('_')[1]).astype(str)

line_frame['ToBus'] = line_frame['LINE_ID'].apply(lambda x: x.split('_')[3].split('~')[0]).astype(str)


line_frame.head()
# %%

bus_locs['BusID'] = bus_locs['BusID']

nf = pd.merge(line_frame, new_lines_df, on=['FromBus','ToBus'])[['LINE_ID', 'FromBus', 'ToBus', 'Vn [kV]', 'Rate1[MVA]', 'Longitude','Latitude']]
#nf[nf['FromBus'].astype(int) > bus_locs['Bus  Number'].astype(int).max()]
#nf = nf[nf['FromBus'].astype(int) <= bus_locs['BusID'].astype(int).max()]
#nf = nf[nf['ToBus'].astype(int) <= bus_locs['BusID'].astype(int).max()]
nf.head()
# %%

bus_locs_index = bus_locs.set_index('BusID')[['Latitude', 'Longitude']]

bus_lats = bus_locs_index['Latitude'].to_dict()
bus_longs = bus_locs_index['Longitude'].to_dict()

nf['From Lat'] = nf['FromBus'].map(bus_lats | new_bus_lat)
nf['From Lon'] = nf['FromBus'].map(bus_longs | new_bus_long)

nf['To Lat'] = nf['ToBus'].map(bus_lats | new_bus_lat)
nf['To Lon'] = nf['ToBus'].map(bus_longs | new_bus_long)


# %%
nf['To Lat'] = nf['To Lat'].fillna(nf['Latitude'])
nf['To Lon'] = nf['To Lon'].fillna(nf['Longitude'])


#nf = nf.drop(columns=['Latitude', 'Longitude']).dropna()
#nf = nf[nf['To Lat'] >  0]
nf.head()
# %%
nf_format = nf[['LINE_ID','Rate1[MVA]', 'Vn [kV]', 'From Lat', 'From Lon', 'To Lat', 'To Lon']].rename(columns={'Rate1[MVA]':'RATE', 'Vn [kV]': 'TO_VN'})
nf_format['TO_VN'] = nf_format['TO_VN'].astype(str) + '_NEW'

nf_format.head()
# %%
from shapely.geometry import LineString
nf_format['geometry'] = nf_format.apply(lambda r: LineString([[r['From Lon'], r['From Lat']], [r['To Lon'], r['To Lat']]]), axis=1)

nf_format.head()
#%%
import geopandas as gpd

new_gdf = gpd.GeoDataFrame(
    nf_format, geometry=nf_format['geometry']
)[['LINE_ID', 'RATE','TO_VN','geometry']]
new_gdf.plot()

# %%
old_gdf = gpd.read_file('../server/assets/AC_Lines_simple.geojson')

# %%

new_and_old = pd.concat([new_gdf, old_gdf])
new_and_old.head()
#%%
new_and_old.to_file('../server/assets/Lines_wNew.geojson', driver='GeoJSON')

#%%
import pandas as pd
import geopandas as gpd

custom_lines = pd.read_csv('customlines.csv')
custom_lines.head()
#%%
new_and_old = gpd.read_file('../server/assets/Lines_wNew.geojson')
#%%
custom_mask = ( new_and_old.LINE_ID.isin(custom_lines.LINE_ID.unique()) )
custom_gdf = new_and_old[custom_mask]
custom_gdf['TO_VN'] = custom_gdf['TO_VN'] + '_Custom'
custom_gdf.head()
# %%
pd.concat([new_and_old, custom_gdf]).to_file('../server/assets/Lines_wNew_custom2.geojson', driver='GeoJSON')
# %%
