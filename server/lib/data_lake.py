# Responsible for connecting with the datalake client and returning files or dataframe objects.


# Reads from the local cache
import s3fs
import polars as pl
import pandas as pd
from functools import lru_cache
import json

class S3Handler:

    def __init__(self, key, secret, endpoint_url, bucket_name) -> None:

        self.bucket_name=bucket_name
        self.s3 = s3fs.S3FileSystem(
            key=key,
            secret=secret,
            endpoint_url=endpoint_url
        )

        #if endpoint_url == 'http://minio:9000':
        #    endpoint_url = 'http://127.0.0.1:9000'

        self.storage_options = {
            'key':key,
            'secret':secret,
            'client_kwargs':{'endpoint_url':endpoint_url}
        }
        print(self.list_projects())


    def list_projects(self):
        """
        lists the first set of directories within the bucket
        returns a list of
        """
        try:
            projects = self.s3.ls(self.bucket_name)
            ptrim = [p.split('/')[-1] for p in projects]
            return ptrim
        except Exception as e:
            return e


    def list_scenarios(self, project):
        """Lists the directories within a given project"""
        try:
            scenarios =  self.s3.ls(f'{self.bucket_name}/{project}')
            strim = [s.split('/')[-1] for s in scenarios]
            return strim

        except Exception as e:
            return e


    def get_scenario_config(self, project, scenario):

        return {
            "layers": self.s3.find(f'{self.bucket_name}/{project}/{scenario}') # list of layers
        }

    def get_scenario_timestamps(self, project, scenario, file_name):

        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/timeseries/{file_name}", 'rb') as f:
            df = pd.read_parquet(f).reset_index()

            return df["DateTime"].to_list()


    @lru_cache(maxsize=10)
    def get_dataframe(self, project, scenario, file_name):

        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/timeseries/{file_name}", 'rb') as f:
            df = pd.read_parquet(f).reset_index()
            df_polars = pl.from_pandas(df)
            if "DateTime" in df_polars.columns:
                df_polars = df_polars.with_columns([pl.col("DateTime").cast(pl.Utf8)])

            return df_polars


    @lru_cache(maxsize=10)
    def get_pickle(self, project, scenario, file_name):


        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/timeseries/{file_name}", 'rb') as f:

            df = pd.read_pickle(f, compression='gzip')
            return df


    #@lru_cache(maxsize=5)
    def get_geofile(self, project, scenario, file_name):

        try:
            with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/geo/{file_name}", "rb") as f:
                return json.loads(f.read())
        except Exception as e:
            print(e)



    def post_file(self, project, scenario, layer, file_name, data):

        # expect a geojson and a parquet file.

        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/{layer}/{file_name}", 'wb') as f:

            f.write(data)




