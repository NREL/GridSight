# create geojson of VRE
# VRE Will update based on generation and curtailment


# create geojson of Battery
# Battery will update like normal generator for now.

# create geojson of Fossil+Everything else
# will need to have a white outline for Coal plants at the least.

#%%
import pandas as pd
import geopandas as gpd
from marmot.scenariohandlers import SIIPScenario
import os

bus_locs_path = os.path.normpath(r'C:\Users\MWEBB\Downloads\Battelle_NorthAmerica_E_221\EI_2031.xlsx') # map to bus if not in gen
gen_locs_path = os.path.normpath(r'C:\Users\MWEBB\Downloads\Battelle_NorthAmerica_E_221\Generators.csv') #actual lat/longs for generator, not bus
scenario_path = os.path.normpath(r'//nrelnas01/PLEXOS CEII/Projects/NTP/04-Scenarios/PCM/Nodal/01-Scenario/St2/MMWG_2031SUM_2021_with_TSsz_scen1_R52_par_BouLI/decomposition_results/geo_decomposition_2023-06-17/Aggregates')

#new_lines_path = os.path.normpath('') #use columns of new lines to create new linestrings
# assume the base transmission will be static

bus_locs = pd.read_excel(bus_locs_path)
gen_locs = pd.read_csv(gen_locs_path)

bus_locs.head()
#%%
import polars as pl
ntps_scenario = SIIPScenario(scenario_path)

gen_df = ntps_scenario.get_generators_tech()
curt_df = ntps_scenario.get_curtailment()
#%%
gen_df_pl = pl.from_pandas(gen_df.droplevel(level=0, axis=1).reset_index())
curt_df_pl = pl.from_pandas(curt_df.droplevel(level=0, axis=1).reset_index())

gen_df_pl.head()
#%%
flow_df = pl.from_pandas(ntps_scenario.get_line_flow_data())
flow_df.head()
#%%
#save timeseries files

gen_df_pl.write_parquet('../server/assets/generators.parquet')
curt_df_pl.write_parquet('../server/assets/curtailment.parquet')
flow_df.write_parquet('../server/assets/power_flow_actual.parquet')

#%%
# for unique technologies,
# map to each bus
temp = gen_df.columns.values

GEN_IDs=[]
RENEWABLEs=[]
for col in temp:

    r = col[0]
    g = col[1]
    RENEWABLEs.append(r)
    GEN_IDs.append(g)

col_dict = {"GEN_ID":GEN_IDs, "TECH":RENEWABLEs}

gen_assets = pd.DataFrame(col_dict)

gen_assets['BUS'] = gen_assets['GEN_ID'].apply(lambda x: x.split('-')[1]).astype(int)

gen_assets.head()
# extract bus number from columns

#%%
# Map to bus
bus_locs_slim = bus_locs[['Bus  Number','Substation Latitude', 'Substation Longitude']].rename(columns={'Bus  Number':'BUS', 'Substation Longitude':'Longitude', 'Substation Latitude':'Latitude'})
bus_locs_slim['BUS'] = bus_locs_slim['BUS'].astype(int)
gen_assets_locs = pd.merge(gen_assets, bus_locs_slim, how='left', on='BUS')
gen_assets_locs.head()


# 1412 assets with no location

#%%
# Create GEOJSON for each type:
import geopandas as gpd
gen_assets_locs = gen_assets_locs.dropna()

gdf = gpd.GeoDataFrame(
    gen_assets_locs,
    geometry=gpd.points_from_xy(gen_assets_locs.Longitude, gen_assets_locs.Latitude),
    #crs="EPSG:4326"
)[['GEN_ID','TECH','geometry']]

gdf.head()
#%%
#vre
vre_gdf = gdf[gdf.TECH.isin({'Wind','PV','Offshore-Wind'})]

nonvre_gdf = gdf[gdf.TECH.isin({'Battery','Hydro','Oil','Landfill-Gas','Gas-CT','Gas-CC','Other','Coal','Nuclear','Gas'})]

#%%
vre_gdf.to_file('../server/assets/vre_locs.geojson',driver='GeoJSON')
nonvre_gdf.to_file('../server/assets/nonvre_locs.geojson',driver='GeoJSON')

#%%
#FOSSIL


#%%
#Battery






