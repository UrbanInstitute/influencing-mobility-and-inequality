import json

import csv
import json
from os import environ as env
from sys import argv as argv


with open("%s/%s/data/mapping/schoolDistricts/geoJson/schoolDistricts_tmp.geojson"%(env["PROJECT_PATH"], argv[1]),"r") as districtFileIn:
    data = json.load(districtFileIn)

features = data["features"]

print(len(features))

for f in features:
    f["id"] = int(f["properties"]["GEOID"])

data["features"] = features


with open("%s/%s/data/mapping/schoolDistricts/geoJson/schoolDistricts.geojson"%(env["PROJECT_PATH"], argv[1]),"w") as districtFileOut:
    json.dump(data, districtFileOut)




# python scripts/mapping/schoolDistricts/generateids.py k12-segregation