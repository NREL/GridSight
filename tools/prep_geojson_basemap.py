#%%
import geopandas as gpd
import pandas as pd
import os
#%%
path = os.path.normpath("C:\\Users\\MWEBB\\Downloads\\ne_50m_admin_0_countries_lakes.zip")

gdf = gpd.read_file(path)
gdf_trim = gdf[gdf.SOV_A3 !='US1']
#gdf = gdf[gdf.iso_a2.isin({'US','CA','MX'})]

#gdf.to_file('../server/assets/states_provinces.geojson', driver='GeoJSON')
#gdf.plot()

states = os.path.normpath("C:\\Users\\MWEBB\Downloads\\ne_50m_admin_1_states_provinces_lakes.zip")

gds = gpd.read_file(states)

gds_trim = gds[gds.iso_a2 == 'US']

tot = pd.concat([ gds_trim[['geometry']] , gdf_trim[['geometry']]], ignore_index=True)
tot.to_file('../server/assets/states_provinces.geojson', driver='GeoJSON')
tot.plot()
#%%
path = os.path.normpath("C:\\Users\\MWEBB\\Downloads\\ne_10m_ocean.zip")

gdf = gpd.read_file(path)
#gdf.to_file('../web/public/ocean.geojson', driver='GeoJSON')

gdf.plot()

# %%
path = os.path.normpath("C:\\Users\\MWEBB\\Downloads\\ne_10m_lakes.zip")

gdf = gpd.read_file(path)
gdf.to_file('../web/public/lakes.geojson', driver='GeoJSON')

gdf.plot()
# %%
path = os.path.normpath("C:\\Users\\MWEBB\\Downloads\\ne_10m_land.zip")

gdf = gpd.read_file(path)


gdf.plot()
# %%
