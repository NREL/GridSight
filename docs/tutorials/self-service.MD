# GridSight Self-Service Guidelines

**GEOJSON property names must match exactly**

**Generator TECH names must map to current color map (See Below)**

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

Run `python upload_test_data.py` to upload the demo data.

## Color Map for Generators
In order to be given an NREL pallette color, TECH values in the generator geojson file must map to one of the following.

    'Nuclear':[50,50,200],
    'Coal':[200,50,50],
    'Gas': [50,200,50],
    'NG':[194, 161, 219],
    'Gas-CT':[194, 161, 219],
    'NG-CT':[194, 161, 219],
    'Gas/OCGT':[194, 161, 219],
    'Gas-CC':[82, 33, 107],
    'NG-CC':[82, 33, 107],
    'Gas/CCGT':[82, 33, 107],
    'Gas/ST':[166, 40, 164],
    'Oil':[61, 51, 118],
    'Oil Shale':[133, 61, 101],
    'Landfill-Gas': [91, 152, 68],
    'Waste': [136, 186, 65],
    'Biomass': [91, 152, 68],
    'PHS':[24, 28, 148],
    'Hydro':[24, 127, 148],
    'Marine':[169, 98, 53],
    "Wind":[0, 182, 239],
    'Onshore Wind':[0, 182, 239],
    'Offshore-Wind':[16, 107, 167],
    'Offshore Wind':[16, 107, 167],
    "Land-based Wind":[0, 182, 239],
    "Wind&PV":[80, 200, 120],
    "Wind/PV":[80, 200, 120],
    "Wind/Solar":[80, 200, 120],
    "PV": [255, 201, 3],
    "Solar PV": [255, 201, 3],
    "Solar":[255, 201,3],
    "dPV":[255, 171, 2],
    'Rooftop PV':[255, 171, 2],
    "VRE":[127, 195, 64],
    'Battery':[255, 74, 136],
    'Other':[255, 127, 187],
    'Curtailment':[225,225,225],
    'Demand':[0,0,0],
