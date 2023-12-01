import requests
import os

# might need to distinguish between generation and transmission layers
def post_generation(url, project, scenario, vre_locs, nonvre_locs, generation_path, curtailment_path):

    timeseries_path = f"{url}/api/new/timeseries/{project}/{scenario}"
    geo_path = f"{url}/api/new/geo/{project}/{scenario}"

    try:
        geo_file = {'file': open(vre_locs, 'rb')}
        r = requests.post(f"{geo_path}/vre_locs.geojson", files=geo_file)
        print(r.content)

    except Exception as e:
        print(e)

    try:
        geo_file = {'file': open(nonvre_locs, 'rb')}
        r = requests.post(f"{geo_path}/nonvre_locs.geojson", files=geo_file)
        print(r.content)

    except Exception as e:
        print(e)


    try:
        generation_file = {'file': open(generation_path, 'rb')}
        r=requests.post(f"{timeseries_path}/generators.parquet", files=generation_file)
        print(r.content)

    except Exception as e:

        print(e)

    try:
        curtailment_path =  {'file': open(curtailment_path, 'rb')}
        r=requests.post(f"{timeseries_path}/curtailment.parquet", files=curtailment_path)
        print(r.content)

    except Exception as e:
        print(e)




def post_transmission(url, project, scenario, flowgeo_path, flow_path):

    timeseries_path = f"{url}/api/new/timeseries/{project}/{scenario}"
    geo_path = f"{url}/api/new/geo/{project}/{scenario}"

    try:
        print("uploading geo file")
        geo_file = {'file': open(flowgeo_path, 'rb')}
        r = requests.post(f"{geo_path}/transmission_map.geojson", files=geo_file)
        print(r.content)

    except Exception as e:

        print(e)

    try:
        print('uploading flow file')
        flow_file = {'file': open(flow_path, 'rb')}
        r=requests.post(f"{timeseries_path}/flow.parquet", files=flow_file)
        print(r.content)

    except Exception as e:

        print(e)



def post_dispatch(url, project, scenario, file_path):

    dispatch_path = f"{url}/api/new/timeseries/{project}/{scenario}"

    try:
        print("uploading dispatch file")
        dispatch_file = {'file': open(file_path, 'rb')}
        r = requests.post(f"{dispatch_path}/dispatch.pickle.gz", files=dispatch_file)
        print(r.content)

    except Exception as e:

        print(e)



def post_timeseries(url, project, scenario, file_path):

    dir, file_name = os.path.split(file_path)

    path = f"{url}/api/new/timeseries/{project}/{scenario}/{file_name}"

    try:
        print(f'Uploading file {file_name}')
        timeseries_file = {'file': open(file_path, 'rb')}
        r = requests.post(path, files=timeseries_file)
        print(r.content)


    except Exception as e:

        print(e)
