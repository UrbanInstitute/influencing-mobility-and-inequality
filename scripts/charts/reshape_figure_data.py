import csv
import us
from os import environ as env
from sys import argv as argv

allLevels = {}
rows = []
with open("%s/%s/data/cleaned_source.csv"%(env["PROJECT_PATH"], argv[1])) as sourceFile:
	reader = csv.reader(sourceFile)
	head = next(reader)
	h = {}
	for i in range(0, len(head)):
		h[head[i]] = i

	for row in reader:
		schoolTypeString = ""
		for schoolType in ["tps", "charter", "magnet", "private"]:
			if(row[h[schoolType]] == "1"):
				schoolTypeString = schoolType
				break
		if(schoolTypeString == ""):
			print ("error error")

		state = us.states.lookup( row[h['fips']].zfill(2)).abbr
		schoolId = row[h["schid"]]
		level = row[h["level"]]

		if(schoolId not in allLevels):
			allLevels[schoolId] = [level]
		else:
			allLevels[schoolId].append(level)

		minorityPercent = float(row[h["minority_school"]]) / float(row[h["population_school"]])
		
		districtMinorityPercent = 0.763666397 #THIS WILL CHANGE, A VAL FROM DATA
		compareMedian = "above" if (minorityPercent > districtMinorityPercent) else "below"

		if(row[h["minority_nbrsch"]] == "" or row[h["population_nbrsch"]] == ""):
			neighbor_minority_percent = "0"
		else:
			neighbor_minority_percent = float(row[h["minority_nbrsch"]]) / float(row[h["population_nbrsch"]])

		rows.append([schoolId,level,row[h["gleaid"]],row[h["REV_Subregion"]], row[h["school_name"]],row[h["gleaname"]],row[h["maname"]],row[h["REV_City"]] ,state,row[h["population_school"]],row[h["minority_school"]],minorityPercent,neighbor_minority_percent, row[h["SCI_sys"]],schoolTypeString,compareMedian, row[h["lon"]], row[h["lat"]], row[h["radius_nbrsch"]], row[h["count_nbrsch"]] ])


with open('%s/%s/data/charts/csv/all_schools.csv'%(env["PROJECT_PATH"], argv[1]), 'w', newline='') as outFile:
	writer = csv.writer(outFile)
	writer.writerow(["schoolId", "level","districtId","countyName","schoolName","distName","msaName","cityName","state","pop", "minority_pop","minority_percent","neighbor_minority_percent", "sci", "type","compareMedian", "lon", "lat","radiusNeighbors", "countNeighbors","allLevels"])

	for row in rows:
		row.append(" ".join(allLevels[row[0]]))
		writer.writerow(row)

