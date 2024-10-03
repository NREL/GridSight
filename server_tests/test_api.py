import requests
import pytest
import gzip
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import numpy as np
import os
import io


base_url = 'http://127.0.0.1:8000/'
api_key = "key2"
headers = headers = {'X-MyApp-ApiKey': api_key}

tmp_dir = './tmp'
os.makedirs(tmp_dir, exist_ok=True)
ts_file_name = 'timeseries.pq.gz'
ts_file_path = os.path.join(tmp_dir, ts_file_name)

user_name = 'demo@example.com'
project_name = 'DEMO'
scenario_name = 'S1'

dt_index = pd.date_range('01-01-2035', '01-31-2035', freq='h')
ts_length = len(dt_index)

# make 20 fake columns
num_cols = 20
cols = ['generator-{}'.format(i) for i in range(num_cols)]

test_df = pd.DataFrame(index=dt_index, columns=cols, data=np.random.rand(ts_length, num_cols))


def create_test_ts_parquet():

    dt_index = pd.date_range('01-01-2035', '01-31-2035', freq='h')
    ts_length = len(dt_index)

    # make 20 fake columns
    num_cols = 20
    cols = ['generator-{}'.format(i) for i in range(num_cols)]

    test_df = pd.DataFrame(index=dt_index, columns=cols, data=np.random.rand(ts_length, num_cols))

    test_df.index.name = 'DATETIME'
    test_df.reset_index(inplace=True)
    table = pa.Table.from_pandas(test_df)
    buffer = io.BytesIO()
    pq.write_table(table, buffer)
    buffer.seek(0)
    return buffer

def gzip_compress(buffer):
    compressed_buffer = io.BytesIO()
    with gzip.GzipFile(fileobj =compressed_buffer, mode='wb') as f:
        f.write(buffer.getvalue())

    compressed_buffer.seek(0)
    return compressed_buffer


def get_timeseries_df(uuid, start_date=None, end_date=None, columns=None):

    query_params = {}

    get_url = base_url+'timeseries/{}'.format(uuid)

    if start_date:
        query_params["start_date"] = start_date
    if end_date:
        query_params["end_date"] = end_date
    if columns:
        query_params["columns"] = columns

    response = requests.get(get_url, data=query_params)

    assert response.status_code == 200
    data = response.content
    stream = pa.ipc.open_stream(io.BytesIO(data))
    table = stream.read_all()
    df = table.to_pandas()
    assert len(df) > 1
    return df


@pytest.fixture
def parquet_ts_file():
    parquet_buf = create_test_ts_parquet()
    compressed_buf = gzip_compress(parquet_buf)
    return compressed_buf

def test_api_root():
    response = requests.get(base_url)

    rjson = response.json()

    print(rjson)


    assert 1 == 1
    return




def test_put_get_delete_timeseries(parquet_ts_file):

    files = {'file': (ts_file_name, parquet_ts_file, 'application/octet-stream')}
    post_url = base_url+'timeseries/{}/{}'.format(project_name, scenario_name)
    r = requests.post(post_url, files=files)

    r.text
    assert r.status_code == 201

    rjson = r.json()

    uuid = rjson['uuid']


    get_url = base_url+'timeseries/{}'.format(uuid)

    # Read entire dataset
    df = get_timeseries_df(uuid)
    assert len(df) > 1



    # Read dataset partitions
    start_date, end_date = '01-02-2035', '01-09-2035'
    df = get_timeseries_df(uuid, start_date, end_date)
    assert len(df)>1


    # Read Columns and Entire Dataset
    df = get_timeseries_df(uuid, columns=cols[0:5])
    assert len(df)>1


    # Read Columns and Partition

    df = get_timeseries_df(uuid, start_date, end_date, columns = cols[0:10])
    assert len(df)>1

    # Remove Dataset

    delete_url = base_url+'timeseries/{}'.format(uuid)
    delete_response = requests.delete(delete_url)

    assert delete_response.status_code == 200
    # need to remove by UUID to for testing purposes.



