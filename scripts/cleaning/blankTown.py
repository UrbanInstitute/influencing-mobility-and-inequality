import csv

cr = csv.reader(open("data/charts/source/CCDPSS2017_SegCounterfactual_geocoded.csv","r"), delimiter=",")
cw = csv.writer(open("data/cleaning/blankTownSource.csv","w"))

header = next(cr)
outCols = ["schid","school_name","REV_Subreg","REV_Region","search_term","hand_code_city"]
cw.writerow(outCols)
# a convenience function to map column header names to row indices
def rowToObject(rowList):
    rowObj = {}
    for i in range(0, len(rowList)):
        rowObj[header[i]] = rowList[i]
    return rowObj

count = 0
schids = []
for rowList in cr:
    row = rowToObject(rowList)
    if(row["REV_City"] == "" and row["schid"] not in schids):
        schids.append(row["schid"])
        outRow = []
        for c in outCols:
            if c in row:
                outRow.append(row[c])
        outRow.append(row["school_name"] + ", " + row["REV_Subreg"] + ", " + row["REV_Region"])
        cw.writerow(outRow)
