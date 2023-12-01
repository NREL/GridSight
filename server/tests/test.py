import requests

base_url = 'http://127.0.0.1:5000/'
api_key = "key2"
headers = headers = {'X-MyApp-ApiKey': api_key}


resp = requests.get(
        f'{base_url}/grid/AC_Lines_simple.geojson',

        headers=headers
    )

print(resp.content)