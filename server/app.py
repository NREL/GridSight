#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, flash, request, redirect, send_file
from flask_rebar import HeaderApiKeyAuthenticator
from flask_rebar import Rebar
import polars as pl
from dotenv import load_dotenv
import os
from lib.data_lake import S3Handler
from urllib.parse import unquote
from uuid import uuid4

s3handler = S3Handler(
    os.environ['ACCESS_KEY'],
    os.environ['SECRET_KEY'],
    os.environ['ENDPOINT_URL'],
    os.environ['BUCKET_NAME']
)


rebar = Rebar()
registry = rebar.create_handler_registry()

load_dotenv()
API_KEY_SEED = os.environ['API_KEY']

authenticator = HeaderApiKeyAuthenticator(header='X-MyApp-ApiKey')
authenticator.register_key(key=API_KEY_SEED, app_name='gridsight-web')
#registry.set_default_authenticator(authenticator)



def make_response(data, status=200, extra_headers={}):
    headers = {'Content-Type': 'application/json'}
    headers.update(extra_headers)
    resp = {
        'statusCode': status,
        'headers': headers,
        'body': data
    }
    return resp

@registry.handles(
        rule='/api/<string:project>/<string:scenario>/<string:name>',
        method='PUT',
        authenticators=authenticator
)
def putParquet(project, scenario, name):

    new_id = str(uuid4())



@registry.handles(
    rule='/api/timestep/<string:project>/<string:scenario>/<int:index>',
    method='GET',
    authenticators=authenticator
)
def getScenarioTimestep(project, scenario, index):

    gen_df = s3handler.get_dataframe(project, scenario, 'generators.parquet')
    curt_df = s3handler.get_dataframe(project, scenario, 'curtailment.parquet')
    flow_df = s3handler.get_dataframe(project, scenario, 'flow.parquet')

    return json.dumps({'generation':gen_df.row(index, named=True), 'flow':flow_df.row(index, named=True), 'curt':curt_df.row(index, named=True)}, default=str)


@registry.handles(
    rule='/api/dispatch/<string:project>/<string:scenario>/meta',
    method='GET',
)
def getDispatchMeta(project, scenario):

    dispatch_df = s3handler.get_pickle(project, scenario, 'dispatch.pickle.gz')

    entities = dispatch_df.columns.get_level_values(level='Entity').unique()
    technologies = dispatch_df.columns.get_level_values(level='Technology').unique()

    max_demand = 0
    if 'Demand' in technologies:

        max_demand = dispatch_df['Demand'].max().to_dict()

    max_dispatch = dispatch_df[[col for col in technologies if col != 'Demand']].T.groupby(level='Entity').sum().T.max().to_dict()

    meta = {
        'entities': list(entities),
        'technologies': list(technologies),
        'max_demand':max_demand,
        'max_dispatch': max_dispatch
    }

    return json.dumps(meta)

@registry.handles(
    rule='/api/dispatch/<string:project>/<string:scenario>/<int:index>',
    method='GET',
    #authenticators=authenticator
)
def getDispatchTimestep(project, scenario, index):

    dispatch_df = s3handler.get_pickle(project, scenario, 'dispatch.pickle.gz')

    result = dispatch_df.iloc[index].groupby(level=['Technology', 'Entity']).sum().unstack().fillna(0.0).T.to_json().replace('\\','')
    #result = dispatch_df.iloc[index].unstack().fillna(0.0).to_json().replace('\\','')

    return json.dumps(result)


@registry.handles(
   rule='/api/grid/<string:name>',
   method='GET',
   authenticators=authenticator
)
def getMap(name):

    geo = json.loads(open(f'./assets/{name}').read())

    return json.dumps(geo)


@registry.handles(
    rule='/api/new/<string:layer>/<string:project>/<string:scenario>/<string:file_name>',
    method='POST',
)
def postFile(layer, project, scenario, file_name):

    if 'file' not in request.files:
        return make_response("file not found", status=400)

    if 'file' in request.files:
        try:
            data = request.files['file']
            s3handler.post_file(project=project, scenario=scenario, layer=layer, file_name=file_name, data=data.read())
            return make_response('file sucessfully uploaded',status=201)

        except Exception as e:
            print(e)
            return make_response('file upload failed', status=400)

    return make_response('file upload failed', status=400)

@registry.handles(
    rule='/api/timeseries/<string:project>/<string:scenario>/files/<string:file_name>',
    method='GET',
    authenticators=authenticator
)
def getFile(project, scenario, file_name):

    df =  s3handler.get_dataframe(project, scenario, file_name)

    return json.dumps(df.write_json())


@registry.handles(
    rule='/api/timeseries/<string:project>/<string:scenario>/lines/<string:line_name>',
    method='GET',
    authenticators=authenticator
)
def getFlow(project, scenario, line_name):

    flow_df = s3handler.get_dataframe(project, scenario, 'flow.parquet')
    print(unquote(line_name))
    print(line_name)
    flow_line = flow_df[[line_name]]

    return flow_line.write_json()


@registry.handles(
    rule='/api/timeseries/<string:project>/<string:scenario>',
    method='GET',
    authenticators=authenticator

)
def listFiles():

    # lists the timeseries files available for plotting.
    return



@registry.handles(
    rule="/api/projects",
    method="GET"
)
def listProjects():
    # Lists the projects currently available, returns a list
    try:
        projects = s3handler.list_projects()
        return make_response(projects)
    except Exception as e:
        print(e)
        return make_response('internal eror', 500)

@registry.handles(
    rule="/api/projects/<string:project>",
    method='GET'
)
def listScenarios(project):
    print(project)
    try:
        scenarios = s3handler.list_scenarios(project)
        return make_response(scenarios)
    except Exception as e:
        print(e)
        return make_response('internal error', 500)



@registry.handles(
    rule='/api/<string:project>/<string:scenario>',
    method='GET'
)
def loadScenarioConfig(project, scenario):

    config = s3handler.get_scenario_config(project, scenario)

    return make_response(config)


@registry.handles(
    rule='/api/geo/<string:project>/<string:scenario>/<string:filename>',
    method='GET',
    authenticators=authenticator
)
def getGeoFile(project, scenario, filename):

    geojson = s3handler.get_geofile(project, scenario, filename)
    return geojson





app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000 * 2000 #~2GB
rebar.init_app(app)




