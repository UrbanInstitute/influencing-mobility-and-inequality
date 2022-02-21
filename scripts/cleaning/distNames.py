import csv
import re

cr = csv.reader(open("data/charts/source/CCDPSS2017_SegCounterfactual_geocoded.csv","r"), delimiter=",")
cw = csv.writer(open("data/cleaning/cleanDistricts.csv","w"))

header = next(cr)
outCols = ["distName","clean_name","skipped", "condition1","condition2","condition3","condition4","condition5"]
cw.writerow(outCols)

regs = \
[\
    [ r'(.*)SCHOOL DIST\.$', r"\1School District", "ends with 'SCHOOL DIST.'"]\
  , [ r'(.*) SD$', r"\1 School District", "ends with 'SD'"]\
  , [ r'(.*) ISD$', r"\1 Independent School District", "ends with 'ISD'"]\
  , [ r'(.*) CISD$', r"\1 Consolidated Independent School District", "ends with 'CISD'"]\
  , [ r'(.*) CHSD$', r"\1 Community High School District", "ends with 'CHSD'"]\
  , [ r'(.*) HSD$', r"\1 High School District", "ends with 'HSD'"]\
  , [ r'(.*) ESD$', r"\1 Elementary School District", "ends with 'ESD'"]\
  , [ r'(.*) MSD$', r"\1 Municipal School District", "ends with 'MSD'"]\
  , [r'(.*)([-| |/]) SD ([-| |/|.])(.*)$', r"\1\1 School District \3\4", "contains ' SD '"]\
  , [r'(.*)([-| |/]) ISD ([-| |/|.])(.*)$', r"\1\1 Independent School District \3\4", "contains ' ISD '"]\
  , [r'(.*)([-| |/]) CISD ([-| |/|.])(.*)$', r"\1\1 Consolidated Independent School District \3\4", "contains ' CISD '"]\
  , [r'(.*)([-| |/]) CHSD ([-| |/|.])(.*)$', r"\1\1 Community High School District \3\4", "contains ' CHSD '"]\
  , [r'(.*)([-| |/]) HSD ([-| |/|.])(.*)$', r"\1\1 High School District \3\4", "contains ' HSD '"]\
  , [r'(.*)([-| |/]) ESD ([-| |/|.])(.*)$', r"\1\1 Elementary School District \3\4", "contains ' ESD '"]\
  , [r'(.*)([-| |/]) MSD ([-| |/|.])(.*)$', r"\1\1 Municipal School District \3\4", "contains ' MSD '"]\
]

skip = []


# a convenience function to map column header names to row indices
def rowToObject(rowList):
    rowObj = {}
    for i in range(0, len(rowList)):
        rowObj[header[i]] = rowList[i]
    return rowObj

changed_dists = []

for rowList in cr:
    write = False
    conditions = []
    row = rowToObject(rowList)
    
    dist_name = row["gleaname"]
    clean_name = dist_name
    
    outRow = []
    for reg in regs:
        p = re.compile(reg[0])
        
        if(p.match(clean_name)):
            if(dist_name in changed_dists):
                write = False
                break
            if(dist_name in skip):
                # outRow = [schid, row["REV_Region"], school_name, school_name, "X", reg[2] ]
                # cw.writerow(outRow)
                # write = False
                break
            else:
                # print(clean_name)
                write = True
                conditions.append(reg[2])
                try:
                    clean_name = p.sub(reg[1], clean_name)
                except:
                    print(clean_name, reg[1])

    if write:
        # print(dist_name, clean_name)
        outRow = [dist_name, clean_name, ""] + conditions
        cw.writerow(outRow)
        changed_dists.append(dist_name)
