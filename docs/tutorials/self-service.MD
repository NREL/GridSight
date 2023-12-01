# GridSight Self-Service Guidelines

Use Marmot.ScenarioHandlers or other tools to create the following parquet files

**GEOJSON property names must match exactly**



## 1. Generator Timeseries and GeoJSON:
- **generation.parquet** (a column for each generator, use marmot.scenariohandlers)
- **curtailment.parquet** (a column for each generator, use marmot.scenariohandlers)
- **vre_locs.geojson** (vre technologies only)
    *properties*
    - GEN_ID: "unique id that matches a column in generation.parquet"
    - TECH: "WIND"

- **nonvre_locs.geojson** (non-vre technologies only)
    *properties *
    -    GEN_ID: "unique id that matches a column in generation.parquet"
    -    TECH: "GAS-CC"

## 2. Transmission Timeseries and GeoJSON:

- create a file called **flow.parquet** using Marmot.scenariohandler (a column for each line, values in MW, not loading %)
- create a geojson file called **transmission.geojson**

    *properties*
    - "LINE_ID": "Unique ID that matches a column in the flow.parquet file"
    - "RATE": "The line rating value (used for loading cal)
    - "TO_VN": "Generally a Voltage, Can be named into any category you want to filter by e.g. 500kV_NEW vs 500kV"


## 3. Upload files using the gridsight_client.py functions.



`post_transmission(gridsight_url, Project_Name, Scenario_Name, path_to_transmission_geojson, path_to_transmission_parquet)`




`post_transmission(gridsight_url, Project_Name, Scenario_Name, path_to_vre_geojson, path_to_nonvre_geojson, path_to_generation_parquet, path_to_curtailment_parquet)`