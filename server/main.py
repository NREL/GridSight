from typing import Union, Optional, List
from fastapi import FastAPI, HTTPException, Response, File, UploadFile, Query
from pydantic import BaseModel
import uvicorn

from starlette import status
from starlette.requests import Request
from uuid import uuid4 as uuid
import io
import gzip
import os

import pyarrow.parquet as pq
import pyarrow.dataset as ds
import pyarrow.compute as pc
import pyarrow as pa
import pandas as pd
from datetime import datetime, timedelta
import shutil



data_dir = './data'
timeseries_dir = os.path.join(data_dir, 'timeseries')
os.makedirs(timeseries_dir, exist_ok=True)
app = FastAPI()

# Maybe users have access to projects and we check
# whether that user has access. Projects are usually done as a team.

class Empty(BaseModel):
    ...
    # Using ConfigDict as warning suggests breaks some tests.
    class Config:
        extra = "forbid"

emptyModel = Empty()

class TimeseriesPostResponse(BaseModel):
    uuid: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


def get_user():
    # For now
    return 'demo@example.com'

def read_timeseries(uuid, start_date=None, end_date=None, columns=None):

    data_path = os.path.join(timeseries_dir, uuid )

    dataset = ds.dataset(data_path, partitioning=["DATE"], format="parquet")


    if start_date == None and end_date == None:
        table = dataset.to_table(columns=columns)
        return table


    if start_date:
        pa_start_date = pa.scalar(pd.Timestamp(start_date).date())
        if end_date:

            pa_end_date = pa.scalar(pd.Timestamp(end_date))
            filtered_dataset = dataset.filter(
                pc.and_(
                    pc.field("DATE") >= pa_start_date,
                    pc.field("DATE") <= pa_end_date
                )
            )
            scanner = filtered_dataset.scanner(columns=columns)
            table = scanner.to_table()
            return table

    else:
        filtered_dataset = dataset.filter(pa.field("DATE") == pa_start_date)
        scanner = filtered_dataset.scanner(columns = columns)
        table = scanner.to_table()
        return table




def save_timeseries_file(table, savepath):

    try:
        ds.write_dataset(
        table,
        base_dir=savepath,
        partitioning=["DATE"],
        partitioning_flavor='hive',
        format="parquet",
        basename_template="{i}.parquet",
        existing_data_behavior="overwrite_or_ignore"
        )
        return 0
    except Exception as e:
        return e

@app.get("/timeseries/{uuid}", status_code=200)
async def get_timeseries(
    uuid: str,
    response: Response,
    start_date: Optional[datetime] = Query(None,
                            alias="start_date",
                            title="Start Date",
                            description="The start date of the dataset partition."),
    end_date: Optional[datetime] = Query(None,
                          alias="end_date",
                          title="End Date",
                          description="The end date partition of the dataset. Will return all timeseries data of that date."),
    columns: Optional[List[str]] = Query(None, alias="columns",
                               title="Timeseries Columns",
                               description = "A list of columns to select from a timeseries dataset.")
    ):
    # TODO, make start and end dates optional

    # parse dates first before trying any data intense tasks

    if uuid in os.listdir(timeseries_dir):
        try:
            table = read_timeseries(uuid, start_date, end_date, columns)
            buffer = io.BytesIO()
            with pa.ipc.new_stream(buffer, table.schema) as writer:
                writer.write_table(table)

            response.headers["Content-Type"] = "application/octet-stream"
            response.headers["Content-Disposition"] = "attachment; filename={}.arrow".format(uuid)

            return Response(buffer.getvalue(), media_type="application/octet-stream")


        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )





@app.post("/timeseries/{project}/{scenario}" , status_code=201)
async def post_timeseries_file(
    file: UploadFile = File(...),
    project:str = None,
    scenario:str = None,
    )->TimeseriesPostResponse:

    if not file.filename.endswith('.pq.gz'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "Only gz compressed parquet files are accepted"
        )

    content = await file.read()

    buffer = io.BytesIO(content)

    with gzip.open(buffer, 'rb') as f:
        parquet_data = f.read()

    table = pq.read_table(io.BytesIO(parquet_data))



    user = get_user()

    file_uuid = str(uuid())

    p = project
    s = scenario

    try:
        tdf = table.to_pandas()
        tdf['DATETIME'] = pd.to_datetime(tdf['DATETIME'])
        tdf['DATE'] = tdf['DATETIME'].dt.date
        new_table = pa.Table.from_pandas(tdf)
        save_path = os.path.join(timeseries_dir, file_uuid)
        save_timeseries_file(new_table, save_path)
        # ensure submitted json is parsable
        # we should be able to receive binary content

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e
        )

    return TimeseriesPostResponse(
        uuid=file_uuid
    )


# Delete TimeSeries
@app.delete("/timeseries/{uuid}")
def delete_timeseries(uuid: str, status_code=200):

    try:
        path = os.path.join(data_dir,'timeseries', uuid )
        shutil.rmtree(path)

    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        )






# infer user from cookies or API key

# GET User Projects and Scenarios
@app.get("/{user}/projects")
def read_user_projects(user_id: str):
    # read the data directory under user to get
    # list of available projects and corresponding scenarios
    # {project1: [scenario1, scenario2, scenario3], project2: [scenario1, scenario2, etc]}
    # NEED FRIENDLY NAMES to EDIT.
    # NEED and Editing process.
    return {}

@app.get("/{user}/{project}/{scenario}/layers")
def read_scenario_layers(user_id: str, project):
    # return an object with UUID for various datasets
    # can autogenerate the styling object on the front end.
    # {name: geometry: uuid.geojson, staticFiles:[{name: propSet1, path: uuid1.csv},{name: propSet2, path: uuid2.pq.gz}], timeseriesFiles: [flow.pq.gz, utilization.pq.gz] }
    # may just want to use parquet exlusively.
    return {}

@app.get("/{user}/{timeseries}/{uuid}/{start}/{stop}")
def read_timeseries_chunk():
    # should read a chunk of parquet data from disk
    # and return it into an arrow format.
    # "file" save to multiple row groups
    #   /Day1/data.pq.gz
    #   /Day2/data.pq.gz

    return
@app.get("/{user}/{static}/{columns}")
def read_static_columns():

    # read a subset of columns from a static parquet file
    return

@app.get("/timeseries/{uuid}/{column}/{start}/{stop}")
def read_timeseries_column():
    # read the timestamps of the file to get a range
    # or read a specific column to drilldown into line or generator
    return



# Other interesting analysis
# Automatic Geospatial join between polygon and point layers
#


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)