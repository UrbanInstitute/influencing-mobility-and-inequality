


function initHistogram(){
///////////////////////////////////////////////////
const BIN_WIDTH = 100000;
const UPPER_BOUND = 2000000;

const MAX_DOTS_IN_GROUP = 80;
const TOTAL_DOTS = 1501;
const DOT_COLS = 5;

const X_BEZIER_CONST = .5
const Y_BEZIER_CONST = -.2

const QUICK_DURATION = 200;
const LONG_DURATION = 1000;

var x;
var y;
var z;
var xAxis;
var yAxis;

const dollarAxisFormat = d3.format("$.2s")

var svg = d3.select("#fixedChartContainer")
    .append("svg")

function getGroupWidth(){
    if(IS_PHONE()){
        return (window.innerWidth-160)
    }
    else return (window.innerWidth-100)/6;

}
function getChartWidth(){
    return getGroupWidth() * 6

}
function getChartHeight(){
    return window.innerHeight - 280;
}
function getDotR(){
    if(getSize() == "desktop" && getChartHeight() > 700) return 2.5
    else return 1.7
}
function getDotPad(){
    if(getSize() == "desktop" && getChartHeight() > 700) return .5
    return .3
}
function getChartMargins(){
    return {"top" : 20, "bottom" : 80, "left": 100, "right" : 0}

}
function getGroupMargins(){
    if(getSize() == "desktop") return {"top" : 0, "bottom" : 0, "left": 40, "right" : 20}
    else return {"top" : 0, "bottom" : 0, "left": 20, "right" : 20}
}
function getActiveTopic(){

}
function setTopic(){

}
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}


function showIntervention(topic, data){
    d3.selectAll(".dotOrigin").remove()
    if(topic != "earnings"){
        topic = "earnings_" + topic
    }
    // console.log(topic)
    d3.selectAll(".arc").remove()
    d3.selectAll(".dot")
    .attr("class", d => `dot bin${d[topic]} bin${d.earnings}`)
    .transition()
    .duration(QUICK_DURATION)
        .attr("cx", (d,i) => getDotPos("earnings", d, data).x )
        .attr("cy", (d,i) => getDotPos("earnings", d, data).y )

    var delayI = 0;
    d3.selectAll(".dot")
        .style("fill", function(d,i){
            var change = +d["change_" + topic]
            if(change == "0"){
                return "#9d9d9d"
            }else{
                return (change == "1") ? "#1696d2" : "#ca5800"
            }
        })
        .transition()
        .ease(d3.easeLinear)
        .delay(function(d,i){
            // console.log(i)
            // if(d.earnings != d[topic]) delayI += 1;
            // console.log(delayI)
            return (d.earnings == d[topic]) ? LONG_DURATION*3  : QUICK_DURATION 
        })
        .duration(function(d){
            return (d.earnings == d[topic]) ? 2*QUICK_DURATION : LONG_DURATION
        })
            .attr("cx", (d,i) => getDotPos(topic, d, data).x )
            .attr("cy", (d,i) => getDotPos(topic, d, data).y )

    var arcs = []
    d3.selectAll(".dot")
    .each(function(d){
        var dot = this;
        if(d.earnings != d[topic]){
            var arcHide = d3.select(this.parentNode)
                .append('path')
                .attr("class",function(){
                    // console.log(d)
                    return `arc bin${d.earnings} bin${d[topic]}`
                })
                .attr('d', function () {
                    var startY = getDotPos("earnings", d, data).y,
                        endY = getDotPos(topic, d, data).y,
                        startX = getDotPos("earnings", d, data).x,
                        endX = getDotPos(topic, d, data).x,
                        distY = startY - endY

                    return [
                            'M',
                            startX , startY,    
                            'C',
                            (startX + distY*X_BEZIER_CONST), (startY + distY*Y_BEZIER_CONST),
                            (endX + distY*X_BEZIER_CONST), (endY - distY*Y_BEZIER_CONST),
                            endX, endY
                        ]
                    .join(' ');
                })
                .style("fill", "none")
                .attr("stroke", function(){
                    var startY = getDotPos("earnings", d, data).y,
                        endY = getDotPos(topic, d, data).y
                    // 
                    return (startY > endY) ? "#1696d2" : "#ca5800"
                })
                .attr("stroke-width", 1)


            // var length = arc.node().getTotalLength();
    arcHide.each(function(){
        arcs.push([this, dot, d3.select(this).attr("d"), this.getTotalLength(), this.parentNode])
        // this.remove()
    })
    // d3.selectAll('.dot').raise()
// console.log(arcs.length)
    
    
    // arc.attr("stroke-dasharray", length + " " + length)
    //     .attr("stroke-dashoffset", length)
    //       .transition()
    //       .ease(d3.easeLinear)
    //       .attr("stroke-dashoffset", 0)
    //     .transition()
    //     .delay(function(d,i){
    //         return (d.earnings == d[topic]) ? 2500 : 500
    //     })
    //     .duration(function(d){
    //         return (d.earnings == d[topic]) ? 1000 : 3000
    //     })

        }
    })
    arcs.forEach(a => animateArc(a[0], a[1], a[2], a[3]))
}

function animateArc(arc, dot, d, length, g){
    tmp = d3.select(dot).clone()
    tmp.style("fill","none")
        .style("stroke","#696969")
        .attr("class","dotOrigin")
d3.select(arc)
//                 .style("fill", "none")
//                 .attr("stroke", "#696969")
//                 .attr("stroke-width", .25)
.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
          .transition()
          .delay(QUICK_DURATION)
          .duration(LONG_DURATION)
          .ease(d3.easeLinear)
          // .attr("stroke-dashoffset",0)
          .attrTween("stroke-dashoffset", function(d,i){
            // console.log(i)
            var arcLength = d3.select(this).attr("stroke-dashoffset")
            return customInterpolate(arc, dot, arcLength)
          })
                .transition()
                .duration(1000)
                .delay(1000)
                .style("opacity", .7)

          // .style("opacity",.3)

}

function customInterpolate(arc, dot, arcLength){
    // console.log(a,b)
    return function(t){
        // console.log(arc, dot, t/LONG_DURATION, t)
        // console.log(t)
        var pointAlongArc = arc.getPointAtLength(arcLength * t)
        // console.log(pointAlongArc)
        d3.select(dot)
            .attr("cx", pointAlongArc.x)
            .attr("cy",pointAlongArc.y)
        return arcLength - t*arcLength

    }

}


function buildScales(data){
    var gw = getGroupWidth(),
        w = getChartWidth(),
        h = getChartHeight(),
        gMargin = getGroupMargins(),
        margin = getChartMargins(),
        maxBin = (UPPER_BOUND/BIN_WIDTH) + 1

    var demographics = [...new Set(data.map(d => d.demographic))]
    z = d3.scaleBand()
        .range([margin.left, w - margin.left - margin.right])
        .domain(["White men+", "White women+", "Black men","Black women","Hispanic men","Hispanic women"])

    x = d3.scaleLinear()
        .range([gMargin.left, gw - gMargin.left - gMargin.right])
        .domain([1, MAX_DOTS_IN_GROUP / DOT_COLS])

    y = d3.scaleLinear()
        .range([margin.top, h - margin.top - margin.bottom])
        .domain([maxBin, 1])

    xAxis = d3.axisBottom(z).tickSizeOuter(0).tickSizeInner(6);

    yAxis = d3.axisLeft(y).ticks(h / 40)
    .tickSizeInner(-w)
    .tickFormat(function(d){
        // return d
        if(d == 1){
            return "≤ " + dollarAxisFormat(BIN_WIDTH)
        }
        else if(d == maxBin){
            return "> " + dollarAxisFormat(UPPER_BOUND)
        }else{
            return dollarAxisFormat((d-1) * BIN_WIDTH) + "–" + dollarAxisFormat((d) * (BIN_WIDTH))
        }
    });
    // yAxis.selectAll(".tick line")
    // .attr("stroke-width", h/40)

}

function buildHistogram(data){

    d3.selectAll(".dot").remove()
    d3.selectAll(".dotOrigin").remove()

    var gw = getGroupWidth(),
        w = getChartWidth(),
        h = getChartHeight(),
        gMargin = getGroupMargins(),
        margin = getChartMargins()

    var demographics = [...new Set(data.map(d => d.demographic))]
    
    svg.attr("width", w)
        .attr("height", h)

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y axis")
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text")
            .attr("class", d => `bin${d}`))
        .call(g => g.selectAll(".tick line")
            .attr("data-bin", d => d)
            .attr("x1", -margin.left)
            .attr("x2", w - margin.right - 2*margin.left)
            .attr("stroke-width", 1 + (h-margin.top-margin.bottom)/(UPPER_BOUND/BIN_WIDTH) + 1)
            .attr("stroke-opacity", (d,i) => (i%2 == 1) ? 0.03 : 0))
            // .on('mouseover', (d,i) => highlightBin(d,i))
            // .on("mouseout", mouseoutBin)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(xAxis)
            .selectAll(".tick text")
      .call(wrap, z.bandwidth())


    var g = svg.selectAll("demographicG")
        .data(demographics)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${z(d)},0)`)

    g.selectAll(".dot")
        .data(D => data.filter(d => d.demographic == D))
        .enter()
        .append("circle")
        .attr("class", d => `dot bin${d.earnings}`)
        .attr("cx", (d,i) => getDotPos("earnings", d, data).x )
        .attr("cy", (d,i) => getDotPos("earnings", d, data).y )
        .attr("r", getDotR())
        .style("fill", "#9d9d9d")
    
    svg.append("rect")
        .attr("x", z("White men+") + gw/2 - 54)
        .attr("y", h-margin.bottom + 23)
        .attr("width", 40)
        .attr("height", 5)
        .attr("class", "menUnder " + getActiveScenario())
        .style("fill", "#a2d4ec")
    svg.append("rect")
        .attr("x", z("White women+") + gw/2 - 62)
        .attr("y", h-margin.bottom + 23)
        .attr("width", 40)
        .attr("height", 5)
        .attr("class", "womenUnder " + getActiveScenario())
        .style("fill", "#a2d4ec")

    svg.append("rect")
        .attr("x", margin.left)
        .attr("y", h-margin.bottom)
        .attr("width", gw)
        .attr("height", 20)
        .style("fill", "rgba(0,0,0,0)")
        .style("cursor","pointer")
        .on("mouseover", function(){
            d3.select(".whiteTt").style("display", "block").classed("men", true)
            d3.selectAll(".menUnder").style("fill","#1696d2")
        })
        .on("mouseout", function(){
            d3.select(".whiteTt").style("display", "none").classed("men", false)
            d3.selectAll(".menUnder").style("fill","#a2d4ec")
        })
    svg.append("rect")
        .attr("x", margin.left + gw)
        .attr("y", h-margin.bottom)
        .attr("width", gw)
        .attr("height", 20)
        .style("fill", "rgba(0,0,0,0)")
        .style("cursor","pointer")
        .on("mouseover", function(){
            d3.select(".whiteTt").style("display", "block").classed("women", true)
            d3.selectAll(".womenUnder").style("fill","#1696d2")
        })
        .on("mouseout", function(){
            d3.select(".whiteTt").style("display", "none").classed("women", false)
            d3.selectAll(".womenUnder").style("fill","#a2d4ec")
        })
}

function highlightBin(d, a, b){
    var bin = d3.select(d.target).attr("data-bin")
    d3.selectAll(".dot").style("opacity", .3)
    d3.selectAll(`.dot.bin${bin}`).style("opacity",1)

    d3.selectAll(".arc").style("opacity",.1)
    d3.selectAll(`.arc.bin${bin}`).style("opacity",1)

    d3.selectAll(".tick text").style("opacity",.3)
    d3.selectAll(`.tick text.bin${bin}`).style("opacity",1)
}
function mouseoutBin(){
    d3.selectAll(".dot").style("opacity",1)
    d3.selectAll(".arc").style("opacity",1)
    d3.selectAll(".tick text").style("opacity",1)
}

function getDotPos(topic, datum, data){
    var demographic = datum.demographic,
        order = +datum['order_' + topic] - 1,
        group = +Math.floor(datum[topic]),
        groupData = data.filter(d => d.demographic == demographic),
        totalDots = groupData.filter(d => d[topic] == group).length,
        dotsInCol = Math.ceil(totalDots/DOT_COLS);
    
    var dotOrder;

    if(totalDots <= DOT_COLS) dotOrder = 1
    dotOrder = Math.floor(order/DOT_COLS)


    var rowNum = (order%DOT_COLS == 0) ? 1 : order%DOT_COLS + 1;
    var dotY;
    var mid;
    if(DOT_COLS%2 == 1){
        mid = Math.ceil(Math.min(DOT_COLS, totalDots)/2)
        if(rowNum == mid) dotY = y(group)
        else if(rowNum < mid) dotY = y(group) - (2*(getDotR()+getDotPad()) * (mid - rowNum))
        else dotY = y(group) + (2*(getDotR()+getDotPad()) * (rowNum - mid))
    }

    return {"x" : x(dotOrder), "y": dotY}
}

function initControls(data){
$("#pickTopic")
 .selectmenu({
  classes: {
    "ui-selectmenu-button": "mainSelectMenu"
  },
        change: function( event, data ) {
            // console.log(event, data, this.value)
        var topic = this.value
        showScenario(topic, 1)
        }
 })
    // .on("change", function(){
    //     var topic = this.value
    //     showScenario(topic, 1)
    // })
$("select.foo")

 .selectmenu({
  classes: {
    "ui-selectmenu-button": "overlayEl overlaySelectMenu"
  },

        change: function( event, garb ) {
            // console.log(event, data, this.value)
        var topic = this.value
        showScenario(topic, 1)

            // cardNum = getActiveCardNum()
            // if(cardNum == 5){
            //     showIntervention(topic, data)
            // }else{
            //     showScenario(topic, getActiveCardNum())
            // }
        }
 })


    // .on("change", function(){
    // console.log(this.value)
    //     var topic = this.value,
    //         cardNum = getActiveCardNum()
    //     if(cardNum == 5){
    //         showIntervention(topic, data)
    //     }else{
    //         showScenario(topic, getActiveCardNum())
    //     }
    // })
d3.selectAll(".scenarioCardContainer")
    .on("click", function(){
        var scenario = d3.select(this).attr("class").replace("scenarioCardContainer","").trim()
        showScenario(scenario, 1)
    })
d3.selectAll(".overlayNavContainer")
    .on("click", function(d){
        var scenario = getActiveScenario(),
            cardNum = d3.select(this).attr("data-card")
        showScenario(scenario, cardNum, "navBar")
    })
d3.selectAll(".overlayNavArrow")
    .on("click", function(){
        var scenario = getActiveScenario(),
            increment = (d3.select(this).attr("id") == "leftNav") ? -1 : 1;
            cardNum = +getActiveCardNum()+increment
        showScenario(scenario, cardNum, "navArrow")

    })
d3.select("#closeOverlay")
    .on("click", closeOverlay)

d3.selectAll(".yaxisLabelContainer")
    .on("mouseover", function(){
        d3.select(this).select(".yaxisTt").style("display","block")
    })
    .on("mouseout", function(){
        d3.select(this).select(".yaxisTt").style("display","none")
    })
d3.select("#liftetimeEarningsInline")
    .on("mouseover", function(){
        d3.select(".generalTT.lifetimeInline").style("display","block")
    })
    .on("mouseout", function(){
        d3.select(".generalTT.lifetimeInline").style("display","none")
    })
d3.select("#whiteInline")
    .on("mouseover", function(){
        d3.select(".generalTT.whiteInline").style("display","block")
    })
    .on("mouseout", function(){
        d3.select(".generalTT.whiteInline").style("display","none")
    })
d3.select("#social-twitter")
    .on("mouseover", function(){
        d3.select(this).attr("src","images/twitterHover.png")
    })
    .on("mouseout", function(){
        d3.select(this).attr("src","images/twitter.png")
    })
d3.select("#social-fb")
    .on("mouseover", function(){
        d3.select(this).attr("src","images/fbHover.png")
    })
    .on("mouseout", function(){
        d3.select(this).attr("src","images/fb.png")
    })
d3.select("#social-email")
    .on("mouseover", function(){
        d3.select(this).attr("src","images/emailHover.png")
    })
    .on("mouseout", function(){
        d3.select(this).attr("src","images/email.png")
    })
d3.select("#social-reddit")
    .on("mouseover", function(){
        d3.select(this).attr("src","images/redditHover.png")
    })
    .on("mouseout", function(){
        d3.select(this).attr("src","images/reddit.png")
    })



}
var EXPLORE_DATA;
function init(data){
    buildScales(data)
    buildHistogram(data)
    initControls(data)
    dispatch.on("showIntervention", function(){
        window.setTimeout(function(){
            showIntervention(getActiveScenario(), data)    
        }, 1500)
        
    })
    dispatch.on("resetIntervention", function(){
        if (d3.selectAll(".arc").nodes().length != 0){
            showIntervention("earnings", data)        
        }
        
    })
}

d3.csv("data/explore.csv")
    .then(init)
///////////////////////////////////////////////////
}
function buildExploreChart(scenario){

}
function animateExploreChart(scenario){
// showIntervention(scenario, EXPLORE_DATA)
d3.select(".legendContainer").transition().style("opacity",1)
dispatch.call("showIntervention")
}
function resetExploreChart(scenario){
d3.select(".legendContainer").transition().style("opacity",0)
dispatch.call("resetIntervention")   
}


initHistogram()
// function 