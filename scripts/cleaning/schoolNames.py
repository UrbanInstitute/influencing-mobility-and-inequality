import csv
import re

cr = csv.reader(open("data/charts/source/CCDPSS2017_SegCounterfactual_geocoded.csv","r"), delimiter=",")
cw = csv.writer(open("data/cleaning/cleanNames.csv","w"))

header = next(cr)
outCols = ["schid","state", "school_name","clean_name","skipped", "condition1","condition2","condition3","condition4","condition5"]
cw.writerow(outCols)

regs = \
[\
  [ r'(.*)El$', r"\1Elementary", "ends with 'El'"]\
, [r'(.*)J H$', r"\1Junior High", "ends with 'J H'"]\
, [r'(.*)H S$', r"\1High School", "ends with 'H S'"]\
, [r'(.*)Sch$', r"\1School", "ends with 'Sch'"]\
, [r'(.*)Ctr$', r"\1Center", "ends with 'Ctr'"]\
, [r'(.*)Acad$', r"\1Academy", "ends with 'Acad'"]\
, [r'(.*)Ltrs$', r"\1Letters", "ends with 'Ltrs'"]\
, [r'(.*)Scis$', r"\1Sciences", "ends with 'Scis'"]\
, [r'(.*)Sci$', r"\1Science", "ends with 'Sci'"]\
, [r'(.*)Part\.$', r"\1Partnership", "ends with 'Part.'"]\
, [r'(.*)Intl$', r"\1International", "ends with 'Intl'"]\
, [ r'(.*)Tech$', r"\1Technology", "ends with 'Tech'"]\
, [ r'(.*)Schl$', r"\1School", "ends with 'Schl'"]\
, [ r'(.*)Jr$', r"\1Junior", "ends with 'Jr'"]\
, [ r'(.*)Sr$', r"\1Senior", "ends with 'Sr'"]\
, [ r'(.*)Cs$', r"\1Charter School", "ends with 'Cs'"]\
, [ r'(.*)Chs$', r"\1Charter School", "ends with 'Chs'"]\
, [ r'(.*)Engr$', r"\1Engineering", "ends with 'Engr'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)El$', r"\1 Elementary", "ends with 'El'"]\
, [ r'(.*)Jshs$', r"\1Junior/Senior High School", "ends with 'Jshs'"]\
, [ r'(.*)Ms$', r"\1Middle School", "ends with 'Ms'"]\
, [ r'(.*)Hs$', r"\1High School", "ends with 'Hs'"]\
, [ r'(.*)Jhs$', r"\1Junior High School", "ends with 'Jhs'"]\
, [ r'^Ps (.*)', r"P.S. \1", "starts with 'Ps ' (to P.S. )"]\
, [ r'^Ps/Is (.*)', r"P.S./I.S. \1", "starts with 'Ps/Is ' (to P.S./I.S. )"]\
, [ r'^Ps/Ms (.*)', r"P.S./M.S. \1", "starts with 'Ps/Ms ' (to P.S./M.S. )"]\
, [ r'^Is (.*)', r"I.S. \1", "starts with 'Is ' (to I.S. )"]\
, [ r'^Ms (.*)', r"M.S. \1", "starts with 'Ms ' (to M.S. )"]\
, [r'(.*)([-| |/])El([-| |/|.])(.*)$', r"\1\2Elementary\3\4", "contains ' El '"]\
, [r'(.*)([-| |/])J H([-| |/|.])(.*)$', r"\1\2Junior High\3\4", "contains ' J H '"]\
, [r'(.*)([-| |/])H S([-| |/|.])(.*)$', r"\1\2High School\3\4", "contains ' H S '"]\
, [r'(.*)([-| |/])Sch([-| |/|.])(.*)$', r"\1\2School\3\4", "contains ' Sch '"]\
, [r'(.*)([-| |/])Ctr([-| |/|.])(.*)$', r"\1\2Center\3\4", "contains ' Ctr '"]\
, [r'(.*)([-| |/]?)Acad([-| |/|.])(.*)$', r"\1\2Academy\3\4", "contains ' Acad '"]\
, [r'(.*)([-| |/]?)Elem([-| |/|.])(.*)$', r"\1\2Elementary\3\4", "contains ' Elem '"]\
, [r'(.*)([-| |/])Ltrs([-| |/|.])(.*)$', r"\1\2Letters\3\4", "contains ' Ltrs '"]\
, [r'(.*)([-| |/])Scis([-| |/|.])(.*)$', r"\1\2Sciences\3\4", "contains ' Scis '"]\
, [r'(.*)([-| |/]?)Sci([-| |/|.])(.*)$', r"\1\2Science\3\4", "contains ' Sci '"]\
, [r'(.*)([-| |/])Part\.([-| |/|.])(.*)$', r"\1\2Partnership\3\4", "contains ' Part. '"]\
, [r'(.*)([-| |/]?)Intl([-| |/|.])(.*)$', r"\1\2International\3\4", "contains ' Intl '"]\
, [r'(.*)([-| |/]?)Tech([-| |/|.])(.*)$', r"\1\2Technology\3\4", "contains ' Tech '"]\
, [r'(.*)([-| |/]?)Schl([-| |/|.])(.*)$', r"\1\3School\3\4", "contains ' Schl '"]\
, [r'(.*)([-| |/]?)Jr([-| |/|.])(.*)$', r"\1\2Junior\3\4", "contains ' Jr '"]\
, [r'(.*)([-| |/]?)Sr([-| |/|.])(.*)$', r"\1\2Senior\3\4", "contains ' Sr '"]\
, [r'(.*)([-| |/])Cs([-| |/|.])(.*)$', r"\1\2Charter School\3\4", "contains ' Cs '"]\
, [r'(.*)([-| |/])Chs([-| |/|.])(.*)$', r"\1\2Charter School\3\4", "contains ' Chs '"]\
, [r'(.*)([-| |/]?)Engr([-| |/|.])(.*)$', r"\1\2Engineering\3\4", "contains ' Engr '"]\
, [r'(.*)([-| |/])i([-| |/|.])(.*)$', r"\1\2I\3\4", "contains ' I '"]\
, [r'(.*)([-| |/])Ii([-| |/|.])(.*)$', r"\1\2II\3\4", "contains ' Ii '"]\
, [r'(.*)([-| |/])Iii([-| |/|.])(.*)$', r"\1\2III\3\4", "contains ' Iiii '"]\
, [r'(.*)([-| |/])Iv([-| |/|.])(.*)$', r"\1\2IV\3\4", "contains ' Iv '"]\
, [r'(.*)([-| |/])V([-| |/|.])(.*)$', r"\1\2V\3\4", "contains ' V '"]\
, [r'(.*)([-| |/])Vi([-| |/|.])(.*)$', r"\1\2VI\3\4", "contains ' Vi '"]\
, [r'(.*)([-| |/])Vii([-| |/|.])(.*)$', r"\1\2VII\3\4", "contains ' Vii '"]\
, [r'(.*)([-| |/])Viii([-| |/|.])(.*)$', r"\1\2VIII\3\4", "contains ' Viii '"]\
, [r'(.*)([-| |/])Ix([-| |/|.])(.*)$', r"\1\2IX\3\4", "contains ' Ix '"]\
, [r'(.*)([-| |/])X([-| |/|.])(.*)$', r"\1\2X\3\4", "contains ' X '"]\
, [r'(.*)([-| |/])Xi([-| |/|.])(.*)$', r"\1\2XI\3\4", "contains ' Xi '"]\
, [r'(.*)([-| |/])Xii([-| |/|.])(.*)$', r"\1\2XII\3\4", "contains ' Xii '"]\
, [r'(.*)([-| |/])Xxiii([-| |/|.])(.*)$', r"\1\2XXIII\3\4", "contains ' Xxiii '"]\
, [r'(.*)(\(The\))(.*)$', r"\1\3", "contains '(The)' (removed)"]\
]

skip = ["Harmony School Of Excellence - El Paso", "Kaizen Education Foundation Dba El Dorado High School", "John Adams Academy - El Dorado Hills","South El Monte High","Adat Ari El Day School","Yosemite National Park El Portal","Calvary Chapel Christian School Of El Centro","Educative Center El Redentor'","Yccs-Assoc Hse El Cuarto Ano Hs","Ps 262 El Hajj Malik El Shabazz Elementary School","Harmony School Of Innovation - El Paso","Temple Beth-El School"]



# a convenience function to map column header names to row indices
def rowToObject(rowList):
    rowObj = {}
    for i in range(0, len(rowList)):
        rowObj[header[i]] = rowList[i]
    return rowObj

count = 0
schids = []
counts = {}

for rowList in cr:
    write = False
    conditions = []
    row = rowToObject(rowList)
    schid = row["schid"]
    
    school_name = row["school_name"]
    clean_name = school_name
    outRow = []
    for reg in regs:
        p = re.compile(reg[0])
        
        if(p.match(clean_name)):
            if(schid in schids):
                write = False
                break
            if(school_name in skip):
                outRow = [schid, row["REV_Region"], school_name, school_name, "X", reg[2] ]
                cw.writerow(outRow)
                write = False
                break
            else:
                if(reg[2]) not in counts:
                    counts[reg[2]] = {"count": 1, "find_regex": str(reg[0]), "replace_regex": str(reg[1])}
                else:
                    counts[reg[2]]["count"] += 1
                write = True
                conditions.append(reg[2])
                try:
                    clean_name = p.sub(reg[1], clean_name)
                except:
                    print(clean_name, reg[1])
    if write:
        outRow = [schid, row["REV_Region"], school_name, clean_name, ""] + conditions
        cw.writerow(outRow)
        schids.append(schid)


cw2 = csv.writer(open("data/cleaning/cleanSummary.csv","w"))
cw2.writerow(["pattern","count","find_regex","replace_regex"])

def fcount(d):
    return d[1]["count"]

countOutput = sorted(counts.items(), key = fcount, reverse=True)
for t in countOutput:
    cw2.writerow([t[0], t[1]["count"], t[1]["find_regex"], t[1]["replace_regex"] ])



    # if(row["REV_City"] == "" and row["schid"] not in schids):
    #     schids.append(row["schid"])
    #     outRow = []
    #     for c in outCols:
    #         if c in row:
    #             outRow.append(row[c])
    #     outRow.append(row["school_name"] + ", " + row["REV_Subreg"] + ", " + row["REV_Region"])
    #     cw.writerow(outRow)
