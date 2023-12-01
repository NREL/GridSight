from marmot.scenariohandlers import SIIPScenario
from gridsight_client import post_generation, post_transmission
# create geojson file



def create_transmission_geo(scenario_dir):


    return



def create_gen_locs_geo(sceneario_dir):

    #create vre locs

    # save to local path

    return




if __name__== "__main__":

    post_generation(gridsight_url, 'NTPS','DEMO', vre_locs, nonvre_locs, generation_path=generation_path, curtailment_path=curtailment_path)
    post_transmission(gridsight_url, 'NTPS','DEMO', flowgeo_path, flow_path=flow_path)