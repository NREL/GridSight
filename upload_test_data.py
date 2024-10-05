from gridsight_client import client
import os

gsc = client()

vre_path = './test_data/vre.geojson'
nonvre_path = './test_data/nonvre.geojson'
gen_ts_path = './test_data/generators.pq.gz'
curt_ts_path = './test_data/curtailment.pq.gz'


trx_path = './test_data/transmission.geojson'
trx_ts_path = './test_data/flow.pq.gz'


gsc.post_generation("Demo", "Demo",  vre_locs=vre_path, nonvre_locs=nonvre_path, generation_path=gen_ts_path, curtailment_path=curt_ts_path)


gsc.post_transmission("Demo", "Demo", flowgeo_path=trx_path, flow_path=trx_ts_path)

