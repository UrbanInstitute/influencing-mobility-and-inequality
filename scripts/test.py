import csv

r2 = csv.reader(open("data/charts/source/CCD-PSS2017_SegCounterfactuals_glea_FINALIZED.csv","r"), delimiter=",")
r1 = csv.reader(open("data/charts/source/combined_source.csv","r"), delimiter=",")

r3 = csv.writer(open("data/extraSchools.csv","w"))
r1s = {}

h1 = next(r1)
h2 = next(r2)

r3.writerow(h2)

for row in r1:
    k = row[0] + "_" + row[2]
    if k not in r1s:
        r1s[k] = ""
    else:
        print(k)

for row in r2:
    k = row[0] + "_" + row[2]
    if k not in r1s:
        r3.writerow(row)

