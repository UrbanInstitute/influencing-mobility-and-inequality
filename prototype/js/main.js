function initHistogram(){
///////////////////////////////////////////////////
const BIN_WIDTH = 50000;
const UPPER_BOUND = 1000000;

const DOT_R = 2;
const DOT_PAD = .1;
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

var svg = d3.select("#graphic")
    .append("svg")

function getGroupWidth(){
    return 200;

}
function getChartWidth(){
    return getGroupWidth() * 6

}
function getChartHeight(){
    return 800;
}
function getChartMargins(){
    return {"top" : 20, "bottom" : 80, "left": 100, "right" : 0}

}
function getGroupMargins(){
    return {"top" : 0, "bottom" : 0, "left": 40, "right" : 20}
}
function getActiveTopic(){

}
function setTopic(){

}
function showIntervention(topic, data){
    d3.selectAll(".arc").remove()
    d3.selectAll(".dot")
    .attr("class", d => `dot bin${d[topic]} bin${d.earnings}`)
    .transition()
    .duration(QUICK_DURATION)
        .attr("cx", (d,i) => getDotPos("earnings", d, data).x )
        .attr("cy", (d,i) => getDotPos("earnings", d, data).y )

    // var delayI = 0;
    d3.selectAll(".dot")
        .style("fill", function(d,i){
            if(d.earnings != d[topic]){
                return (+d.earnings > +d[topic]) ? "#e88e2d" : "#fdbf11"
            }else{
                return "#9d9d9d"
            }
        })
        .transition()
        .ease(d3.easeLinear)
        .delay(function(d,i){
            // console.log(i)
            // if(d.earnings != d[topic]) delayI += 1;
            // console.log(delayI)
            return (d.earnings == d[topic]) ? LONG_DURATION*2  : QUICK_DURATION 
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
                    return (startY > endY) ? "#fdbf11" : "#e88e2d"
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
        .domain(["White and Other Male", "White and Other Female", "Black Male","Black Female","Hispanic Male","Hispanic Female"])

    x = d3.scaleLinear()
        .range([gMargin.left, gw - gMargin.left - gMargin.right])
        .domain([1, MAX_DOTS_IN_GROUP / DOT_COLS])

    y = d3.scaleLinear()
        .range([margin.top, h - margin.top - margin.bottom])
        .domain([maxBin, 1])

    xAxis = d3.axisBottom(z).tickSizeOuter(0).tickSizeInner(6);
    yAxis = d3.axisLeft(y).ticks(2 + h / 40)
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
            .attr("x2", w - margin.left - margin.right)
            .attr("stroke-width", 1 + (h-margin.top-margin.bottom)/(UPPER_BOUND/BIN_WIDTH) + 1)
            .attr("stroke-opacity", (d,i) => (i%2 == 1) ? 0.03 : 0))
            .on('mouseover', (d,i) => highlightBin(d,i))
            .on("mouseout", mouseoutBin)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(xAxis);

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
        .attr("r", DOT_R)
        .style("fill", "#9d9d9d")
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
        group = +datum[topic],
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
        else if(rowNum < mid) dotY = y(group) - (2*(DOT_R+DOT_PAD) * (mid - rowNum))
        else dotY = y(group) + (2*(DOT_R+DOT_PAD) * (rowNum - mid))
    }

    return {"x" : x(dotOrder), "y": dotY}
}

function initControls(data){
    d3.select("#tmp")
    .on("change", function(){
    // console.log(this.value)
        var topic = this.value
        showIntervention(topic, data)
    })
}

function init(data){
    buildScales(data)
    buildHistogram(data)
    initControls(data)
}

d3.csv("data/data.csv")
    .then(init)
///////////////////////////////////////////////////
}

initHistogram()
// function 