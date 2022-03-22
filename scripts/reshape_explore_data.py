import csv 
import math
import pprint

binWidth = 100000
upperBound = 2000000
lowerBound = binWidth

cr = csv.reader(open("data/source/source_kb.csv"))

head = next(cr)

data = []

def getBin(val):
    if(float(val) > upperBound):
        return int(upperBound/binWidth) + int(1)
    elif(float(val) < lowerBound):
        return 1
    else:
        return int(math.ceil(float(val)/binWidth))

def getChange(e, v):
    diff = float(v) - float(e)
    # print(diff)

    if(diff > 0 and diff > 100):
        v = "1"
    elif(diff < 0 and diff < -100):
        v = "-1"
    else:
        v = "0"
    # print(diff, v)
    return v

topics = ["earnings","earnings_hs","earnings_ba","earnings_aa","earnings_justice", "earnings_race", "earnings_comm",'earnings_job_quality','earnings_job_training']
r = 0;
for row in cr:
    d = {}
    for i,h in enumerate(head):
        d[h] = row[i]
    cat = d["demographic"] = d["race"] + " " + d["sex"]
    cat = cat.replace("White and Other Male","White men+")
    cat = cat.replace("White and Other Female","White women+")
    cat = cat.replace("Male","men")
    cat = cat.replace("Female","women")
    
    d["demographic"] = cat
    d["earnings"] = getBin(d["o_lifetime_earn"])
    d["earnings_hs"] = getBin(d["life_earn_HS"])
    d["earnings_ba"] = getBin(d["life_earn_BA"])
    d["earnings_aa"] = getBin(d["life_earn_AA"])
    d["earnings_hs"] = getBin(d["life_earn_HS"])
    d["earnings_justice"] = getBin(d["life_earn_CJ"])
    d["earnings_race"] = getBin(d["life_earn_race"])
    d["earnings_comm"] = getBin(d["life_earn_isscommschools"])
    d["earnings_job_quality"] = getBin(d["life_earn_jobquality"])
    d["earnings_job_training"] = getBin(d["life_earn_jobtraining"])

    d["change"] = 0
    d["change_hs"] = getChange(d["o_lifetime_earn"], d["life_earn_HS"])
    d["change_ba"] = getChange(d["o_lifetime_earn"], d["life_earn_BA"])
    d["change_aa"] = getChange(d["o_lifetime_earn"], d["life_earn_AA"])
    d["change_hs"] = getChange(d["o_lifetime_earn"], d["life_earn_HS"])
    d["change_justice"] = getChange(d["o_lifetime_earn"], d["life_earn_CJ"])
    d["change_race"] = getChange(d["o_lifetime_earn"], d["life_earn_race"])
    d["change_comm"] = getChange(d["o_lifetime_earn"], d["life_earn_isscommschools"])
    d["change_job_quality"] = getChange(d["o_lifetime_earn"], d["life_earn_jobquality"])
    d["change_job_training"] = getChange(d["o_lifetime_earn"], d["life_earn_jobtraining"])



    d["tmp_id"] = r
    r += 1
    # print(r)
    data.append(d)

ordered = {}
for d in data:
    if d["demographic"] not in ordered:
        ordered[d["demographic"]] = {}
    for h in topics:
        if h != "demographic":
            # print(d[h])
            if h not in ordered[d["demographic"]]:
                ordered[d["demographic"]][h] = {}
            if d[h] not in ordered[d["demographic"]][h]:
                ordered[d["demographic"]][h][d[h]] = []
            ordered[d["demographic"]][h][d[h]].append(d["tmp_id"])
            d["order_" + h] = len(ordered[d["demographic"]][h][d[h]])
            # pprint.pprint(d)
                


# pprint.pprint(ordered)


cw = csv.writer(open("data/explore.csv",'w'))

outHead = ["demographic"]
for t in topics:
    outHead.append(t)
    outHead.append("order_" + t)
    outHead.append("change_" + t)

cw.writerow(outHead)


for d in data:
    # print(d)
    r1 = [ [d[x],d["order_" + x], d[x.replace("earnings", "change")]] for x in topics]
    r = [d["demographic"]] + [x for tup in r1 for x in tup]
    cw.writerow(r)
    # d[""]