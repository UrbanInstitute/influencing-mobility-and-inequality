import random
import math
import csv


N = 1000
ratios = {"white":{"male":.3, "female": .3}, "black":{"male":.1, "female": .1}, "hispanic":{"male":.1, "female": .1}}
bins = 50

cw = csv.writer(open("dummyData.csv","w"))
cw.writerow(["sex", "race","incomeBefore","incomeAfter", "binBefore","binAfter"])

targetMu = {}
targetMu["after"] = {"white":{"male":672298, "female": 442483}, "black":{"male":278379, "female": 411725}, "hispanic":{"male":499787, "female": 359344}, "all": 484428}
targetMu["before"] = {"white":{"male":592168, "female": 396321}, "black":{"male": 239743, "female": 377949}, "hispanic":{"male":436453, "female": 317239}, "all": 429230}




rows = []

for sex in ["male", "female"]:
    for race in ["white", "black", "hispanic"]:
        n = int(N * ratios[race][sex])
        before = targetMu["before"][race][sex]
        after = targetMu["after"][race][sex]
        for i in range(0, n):
            randBefore = before + before*random.gauss(0,1)*.1
            randAfter = randBefore * after/before
            rows.append([sex, race, randBefore, randAfter])

minBefore = min(r[2] for r in rows)
maxBefore = max(r[2] for r in rows)

binWidth = (maxBefore - minBefore) / bins

cavg = csv.writer(open("means.csv","w"))
cavg.writerow(["int", "race","sex","bin"])

# before = targetMu["before"][race][sex]
# after = targetMu["after"][race][sex]
# binBefore = math.ceil((before - minBefore)/binWidth)
# binAfter = math.ceil((after - minBefore)/binWidth)

cavg.writerow(["before", "all", "all", math.ceil((targetMu["before"]["all"] - minBefore)/binWidth)])
cavg.writerow(["after", "all", "all", math.ceil((targetMu["after"]["all"] - minBefore)/binWidth)])



for sex in ["male", "female"]:
    for race in ["white", "black", "hispanic"]:
        before = targetMu["before"][race][sex]
        after = targetMu["after"][race][sex]
        binBefore = math.ceil((before - minBefore)/binWidth)
        binAfter = math.ceil((after - minBefore)/binWidth)

        cavg.writerow(["before", race, sex, binBefore])
        cavg.writerow(["after", race, sex, binAfter])

# minAfter = min(r[3] for r in rows)
# maxAfter = max(r[3] for r in rows)

for r in rows:
    binBefore = math.ceil((r[2] - minBefore)/binWidth)
    binAfter = math.ceil((r[3] - minBefore)/binWidth)
    r.append(binBefore)
    r.append(binAfter)
    cw.writerow(r)
# print(ratios)
