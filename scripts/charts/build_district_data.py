import json
import csv

from os import environ as env
from sys import argv as argv


workingDict = {}
outDict = {}


with open("%s/%s/data/cleaned_source.csv"%(env["PROJECT_PATH"], argv[1])) as sourceFile:
	reader = csv.reader(sourceFile)
	head = next(reader)
	h = {}
	for i in range(0, len(head)):
		h[head[i]] = i

	for row in reader:
		gleaid = row[h["gleaid"]]
		districtName = row[h["gleaname"]]
		level = row[h["level"]]
		districtKey = gleaid + "_" + level

		sci = float(row[h["SCI_sys"]])

		tps = row[h["tps"]] == "1"
		private = row[h["private"]] == "1"
		charter = row[h["charter"]] == "1"
		magnet = row[h["magnet"]] == "1"

		pop = float(row[h["population_school"]])
		minority = float(row[h["minority_school"]])

		minority_percent = minority/pop

		if districtKey not in workingDict:
			workingDict[districtKey] = {"districtName": districtName, "sumPop": 0, "sumMinority": 0, "minorityPercents": [], "tps": {"sci": 0, "pop": 0}, "private": {"sci": 0, "pop": 0}, "charter": {"sci": 0, "pop": 0}, "magnet": {"sci": 0, "pop": 0}, "schoolList": [] }
		

		if tps:
			workingDict[districtKey]["tps"]["sci"] += sci
			workingDict[districtKey]["tps"]["pop"] += pop
		if private:
			workingDict[districtKey]["private"]["sci"] += sci
			workingDict[districtKey]["private"]["pop"] += pop
		if charter:
			workingDict[districtKey]["charter"]["sci"] += sci
			workingDict[districtKey]["charter"]["pop"] += pop
		if magnet:
			workingDict[districtKey]["magnet"]["sci"] += sci
			workingDict[districtKey]["magnet"]["pop"] += pop

		workingDict[districtKey]["schoolList"].append( {"pop": pop, "minority": minority_percent, "sci": sci })
		workingDict[districtKey]["sumPop"] += pop
		workingDict[districtKey]["sumMinority"] += minority
		workingDict[districtKey]["minorityPercents"].append(minority_percent)

for item in workingDict.items():
	districtKey = item[0]
	d = item[1]

	sumPop = d["sumPop"]
	M = d["sumMinority"]/sumPop
	diffList = [abs(m - M) for m in d["minorityPercents"]]
	sumDiff = sum(diffList)
	# if(districtKey == "5509600_1"):
	typeCheck = sum([float(d["tps"]["sci"]), float(d["private"]["sci"]), float(d["charter"]["sci"]), float(d["magnet"]["sci"])])
	if abs(typeCheck-1) >= .000001:
		print("SCI sum for all schools by type in dist %s is %f"%(districtKey, typeCheck))
	# 	print(districtKey, M, sumDiff)

	belowPop = 0;
	abovePop = 0;
	belowSchools = 0;
	aboveSchools = 0;
	belowSCI = 0;
	aboveSCI = 0;

	print(M)

	if len(d["schoolList"]) > 100:
		print(len(d["schoolList"]))
	for s in d["schoolList"]:
		if(s["minority"] < M):
			belowPop += s["pop"]
			belowSchools += 1
			belowSCI += s["sci"]
		else:
			abovePop += s["pop"]
			aboveSchools += 1
			aboveSCI += s["sci"]
	
	mCheck = aboveSCI + belowSCI
	if abs(mCheck-1) >= .000001:
		print("SCI sum for all schools by M in dist %s is %f"%(districtKey, mCheck))

	if (abovePop - belowPop == 0):
		print("In %s above and below schools same population"%districtKey, abovePop, belowPop, sumPop, d["districtName"])
	# print(abovePop/sumPop - aboveSCI)

# don't include aboveSCI and belowSCI since they're always 50/50
	outDict[districtKey] = {"districtName": d["districtName"], "totalPop":sumPop, "sum" : sumDiff, "M": M, "abovePop": abovePop/ sumPop, "belowPop": belowPop/ sumPop, "aboveSchools": aboveSchools, "belowSchools": belowSchools,  "tps": {"sci": d["tps"]["sci"], "pop": d["tps"]["pop"]/ sumPop }, "private": {"sci": d["private"]["sci"], "pop": d["private"]["pop"]/ sumPop }, "charter": {"sci": d["charter"]["sci"], "pop": d["charter"]["pop"]/ sumPop }, "magnet": {"sci": d["magnet"]["sci"], "pop": d["magnet"]["pop"]/ sumPop }}


		# print(districtKey, M)
	# print(districtKey)

with open("%s/%s/data/charts/json/all_districts.json"%(env["PROJECT_PATH"], argv[1]), "w") as fp:
    json.dump(outDict, fp)


