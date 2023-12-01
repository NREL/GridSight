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


    @lru_cache(maxsize=10)
    def get_dataframe(self, project, scenario, file_name):


        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/timeseries/{file_name}", 'rb') as f:

            df = pl.read_parquet(f)
            if "DateTime" in df.columns:
                df = df.with_columns([pl.col("DateTime").cast(pl.Utf8)])

            return df


    @lru_cache(maxsize=10)
    def get_pickle(self, project, scenario, file_name):


        with self.s3.open(f"{self.bucket_name}/{project}/{scenario}/timeseries/{file_name}", 'rb') as f:

            df = pd.read_pickle(f, compression='gzip')
            return df


    @lru_cache(maxsize=5)
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




