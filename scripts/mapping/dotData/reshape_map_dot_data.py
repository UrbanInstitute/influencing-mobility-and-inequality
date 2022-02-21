import csv
import json
from os import environ as env
from sys import argv as argv


with open("%s/%s/data/charts/json/all_districts.json"%(env["PROJECT_PATH"], argv[1]),"r") as districtFile:
	districtData = json.load(districtFile)

	with open("%s/%s/data/charts/source/CCD-PSS2017_SegCounterfactuals_glea_FINALIZED.csv"%(env["PROJECT_PATH"], argv[1])) as sourceFile:
		reader = csv.reader(sourceFile)
		head = next(reader)
		h = {}
		for i in range(0, len(head)):
			h[head[i]] = i

		with open('%s/%s/data/mapping/dotData/csv/allSchools.csv'%(env["PROJECT_PATH"], argv[1]), 'w', newline='') as outFile:
			writer = csv.writer(outFile)
			writer.writerow(["schoolId","districtId","level","type","lon","lat","population","compareMedian"])
			for row in reader:
				schoolTypeString = ""
				for schoolType in ["tps", "charter", "magnet", "private"]:
					if(row[h[schoolType]] == "1"):
						schoolTypeString =schoolType
						break
				if(schoolTypeString == ""):
					print ("error error")

				districtId = row[h["gleaid"]]
				level = row[h["level"]]
				M = districtData[districtId + "_" + level]["M"]

				minorityPercent = float(row[h["minority_school"]]) / float(row[h["population_school"]])
				
				districtMinorityPercent = M
				compareMedian = "above" if (minorityPercent > districtMinorityPercent) else "below"

				writer.writerow([row[h["schid"]], districtId, level, schoolTypeString , row[h["lon"]], row[h["lat"]], row[h["population_school"]], compareMedian ])
