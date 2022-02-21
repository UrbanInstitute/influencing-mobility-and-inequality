import csv

def rowToObject(rowList, header):
    rowObj = {}
    for i in range(0, len(rowList)):
        rowObj[header[i]] = rowList[i]
    return rowObj

blankTownSourceReader = csv.reader(open("data/cleaning/blankTownSource.csv","r"), delimiter=",")
blankTownHandReader = csv.reader(open("data/cleaning/blankTown.csv","r"), delimiter=",")

f = open("data/cleaning/blankTownFinal.csv","w")

blankTownFinalWriter = csv.writer(f, delimiter="\t")

blankTownSourceHeader = next(blankTownSourceReader)
blankTownHandHeader = next(blankTownHandReader)
# print(blankTownSourceHeader)

blankTownFinalWriter.writerow(blankTownHandHeader)

blankRows = []
for row in blankTownSourceReader:
    blankRows.append(row)

for (i,row) in enumerate(blankTownHandReader):
    blankRows[i].append(row[-1])

for blankRow in blankRows:
    blankTownFinalWriter.writerow(blankRow)


f.close()



sourceOrigReader = csv.reader(open("data/charts/source/CCD-PSS2017_SegCounterfactuals_glea_FINALIZED.csv","r"), delimiter=",")
sourceGeoReader = csv.reader(open("data/charts/source/CCDreverse_geocoded.csv","r"), delimiter=",")

f2 = open("data/charts/source/combined_source.csv","w")
combinedWriter = csv.writer(f2)

r1s = {}
r2s = []

for row in sourceOrigReader:
    k = row[0] + "_" + row[2]
    r1s[k] = row[0:24]

for row in sourceGeoReader:
    k = row[1] + "_" + row[3]
    if(k in r1s):
        r2s.append([k, row[27:]])


print(len(r2s))

for tup in r2s:
    combinedWriter.writerow(r1s[tup[0]] + tup[1])

f2.close()

sourceReader = csv.reader(open("data/charts/source/combined_source.csv","r"))
blankTownReader = csv.reader(open("data/cleaning/blankTownFinal.csv","r"), delimiter="\t")
namesReader = csv.reader(open("data/cleaning/cleanNames.csv","r"))
distsReader = csv.reader(open("data/cleaning/cleanDistricts.csv","r"))

finalWriter = csv.writer(open("data/cleaned_source.csv","w"))

blankTownHeader = next(blankTownReader)
sourceHeader = next(sourceReader)
namesHeader = next(namesReader)
distsHeader = next(distsReader)


finalWriter.writerow(sourceHeader)


blankDict = {}
for rowList in blankTownReader:
    row = rowToObject(rowList, blankTownHeader)
    blankDict[row["schid"]] = row["hand_code_city"]

namesDict = {}
for rowList in namesReader:
    row = rowToObject(rowList, namesHeader)
    namesDict[row["schid"]] = row["clean_name"].title().strip()

distsDict = {}
for rowList in distsReader:
    row = rowToObject(rowList, distsHeader)
    clean = row["clean_name"].title().strip()

    distsDict[row["distName"]] = clean


# print(blankDict)
for rowList in sourceReader:
    row = rowToObject(rowList, sourceHeader)
    schid = row["schid"]
    dist = row["gleaname"]
    name = row["school_name"]

    cityIndex = sourceHeader.index("REV_City")
    namesIndex = sourceHeader.index("school_name")
    distIndex = sourceHeader.index("gleaname")

    if schid in blankDict:
        rowList[cityIndex] = blankDict[schid]
    if schid in namesDict:
        rowList[namesIndex] = namesDict[schid]
    else:
        rowList[namesIndex] = name.title()
    if dist in distsDict:
        rowList[distIndex] = distsDict[dist]
    else:
        if(dist.title().find("District") == -1):
            rowList[distIndex] = dist.title() + " School District"
        else:
            rowList[distIndex] = dist.title()




    finalWriter.writerow(rowList)
