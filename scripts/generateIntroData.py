import csv
import random
import numpy as np    
from matplotlib import pyplot as plt


totalT = 4500
travelT = 400
totalD = 1500
totalBins = 100
minEarn = -100
maxEarn = 100

allDots = {}
allDotsInt = {}

testStartTimes = []
testEndEarnings = []

for t in range(0,totalD):
    dotVals = []
    # Gaussian dist of start times, but don't start before 0ms, or end after totalT ms
    t0 = min(totalT*2 - 4*travelT, max(0,(random.betavariate(2,2))*totalT))
    testStartTimes.append(t0)
    unBinnedEndEarnings = min(100, max(-100,random.gauss(0,38)))
    bw = (maxEarn-minEarn)/totalBins
    endEarnings = round(unBinnedEndEarnings/bw) * bw
    # 
    endEarningsInt = 0
    earnings3Int = 0
    earnings2Int = 0
    if((endEarnings > 0 and random.random() < .8) or (endEarnings < 0 and random.random() < .2)):
        dotColor = "b"
        earnings0 = 0 + random.uniform(-2, 30)
        earnings3 = endEarnings - random.uniform(-1, 5)
        delt = earnings3 - earnings0
        earnings2 = earnings3 - .5*delt + random.uniform(-5,5)
        earnings1 = earnings2 - .5*delt + random.uniform(-5,5)
        endEarningsInt = endEarnings
    else:
        dotColor = "y"
        earnings0 = 0 - random.uniform(-2, 30)
        earnings3 = endEarnings + random.uniform(-1, 5)
        delt = earnings3 - earnings0
        earnings2 = earnings3 - .5*delt + random.uniform(-5,5)
        earnings1 = earnings2 - .5*delt + random.uniform(-5,5)
        endEarningsInt = endEarnings
        if(random.random() < .1):
            dotColor = "yI"
            unBinnedEndEarningsInt = min(100,endEarnings + random.uniform(20, 50))
            endEarningsInt = round(unBinnedEndEarningsInt/bw) * bw
            earnings3Int = endEarningsInt - random.uniform(-1,5)
            deltInt = earnings3Int - earnings1
            earnings2Int = earnings1 + .5*delt + random.uniform(-5,5)



    dotVals = [t, t0, dotColor, earnings0, earnings1, earnings2, earnings3, endEarnings, earnings2Int, earnings3Int, endEarningsInt]

    if(endEarnings not in allDots):
        allDots[endEarnings] = []
    allDots[endEarnings].append(dotVals)

    if(endEarningsInt not in allDotsInt):
        allDotsInt[endEarningsInt] = []
    allDotsInt[endEarningsInt].append(dotVals)

cw = csv.writer(open('data/intro.csv','w'))
cw.writerow(['t0','dotColor','earnings0','earnings1','earnings2','earnings3','earnings4','earnings2Int', 'earnings3Int', 'earnings4Int','earnings4Ind','earnings4IntInd'])

tmpDict = {}
for ee in allDotsInt:
    l = allDotsInt[ee]
    s = sorted(l, key=lambda x:x[1])
    for i,r in enumerate(s):
        tmpDict[r[0]] = i
        

for ee in allDots:
    l = allDots[ee]
    s = sorted(l, key=lambda x:x[1])
    for i,r in enumerate(s):
        r.append(i)
        r.append(tmpDict[r[0]])
        cw.writerow(r[1:])







# sketching code/scratch pad

# Show a histogram of start times, aiming of ramp up, then big surge, then ramp down
# a = np.array(testStartTimes)
# testBins = []
# for i in range(0,20):
#     bw = totalT/20
#     testBins.append(i*bw)
# fig, ax = plt.subplots(figsize =(10, 7))
# ax.hist(a, bins = testBins)
# plt.show()


# a = np.array(testEndEarnings)
# testBins = []
# for i in range(0,totalBins):
#     bw = (maxEarn-minEarn)/totalBins
#     testBins.append(minEarn+ i*bw)
# fig, ax = plt.subplots(figsize =(10, 7))
# ax.hist(a, bins = testBins)
# plt.show()


# def generateDot(endEarnings, t0,color):
