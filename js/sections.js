

/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/
var activeIndex = 0;
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.

  // var dotMargin = (IS_PHONE() ) ? PHONE_DOT_MARGIN : DOT_MARGIN;

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  // var activeIndex = 0;


  // main svg used for visualization
  var svg = null;
  var svgExplore = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;
  var gExplore = null;

  // var barPadding = (IS_PHONE()) ? .4 : .1
  // var x = d3.scaleBand().rangeRound([0, width]).padding(barPadding),
  // y = d3.scaleLinear().rangeRound([barsHeight, 0]);

  // y.domain([0, 18000]);

  // var dotY = d3.scaleLinear().rangeRound([height - dotMargin.bottom, barsHeight + dotMargin.top]);
  // dotY.domain([dotMin, dotMax]);

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];


  /**
  * chart
  *
  * @param selection - the current d3 selection(s)
  *  to draw the visualization in. For this
  *  example, we will be drawing it in #narrativeVizContainer
  */
  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).append('svg')
      // @v4 use merge to combine enter and existing selection
      var introMargin = getIntroChartMargins();
      var exploreMargin = getIntroChartMargins();
      // svg = svg.merge(svgE);

      svg.attr('width', getIntroChartWidth("narrative") + introMargin.left + introMargin.right);
      svg.attr('height', getIntroChartHeight("narrative") + introMargin.top + introMargin.bottom );

      svg.append('g');




      // this group element will be used to contain all
      // other elements.
      g = d3.select('g')
        .attr('transform', 'translate(' + introMargin.left + ',' + introMargin.top + ')');


      svgExplore = d3.select("#exploreVChartContainer").append('svg')
      svgExplore.attr('width', getExploreChartWidth("explore") + exploreMargin.left + exploreMargin.right);
      svgExplore.attr('height', getExploreChartHeight("explore") + exploreMargin.top + exploreMargin.bottom + 120);
      svgExplore.append('g').attr("id","exploreGroup");

      g = svg.select('g')
        .attr('transform', 'translate(' + introMargin.left + ',' + introMargin.top + ')');
      gExplore = svgExplore.select('g')
        .attr('transform', 'translate(' + exploreMargin.left + ',' + exploreMargin.top + ')');


      // perform some preprocessing on raw data
      var introData = rawData[0];
      var twoDotData = rawData[1]
      var exploreData = rawData[2]

      var dHigh = null,
          dLow = null,
          dInt = null

      bindGlobalData(introData, twoDotData, exploreData);
      setupVis(introData, twoDotData, exploreData);
      setupSections(introData, twoDotData, exploreData);

      dispatch.call("dataLoad")

    });
  };



  /**
  * setupVis - creates initial elements for all
  * sections of the visualization.
  *
  * @param wordData - data object for each word.
  * @param fillerCounts - nested data that includes
  *  element for each filler word type.
  * @param histData - binned histogram data
  */
  var setupVis = function (introData, twoDotData, exploreData) {
    var introX = getIntroX(),
        introY = getIntroY()

    var defs = svg.append("defs")
    var arrowHead = defs.append("marker")
      .attr("id","arrowHead")
      .attr("markerWidth",6)
      .attr("markerHeight",6)
      .attr("refX",0)
      .attr("refY",3)
      .attr("orient","auto")
    arrowHead.append("polygon")
      .attr("points","0 0, 6 3, 0 6")
    
    svg.append("g")
      .attr("id", "introAxisLabel")
      .attr("class", "step0")
      .attr("transform", "translate(" + (introX(4) - 15) + "," + (getIntroChartHeight()*.5) + ") rotate(90)")
      .append("text") 
      .text("Lifetime earnings")
      .attr("dy", ".35em")
      .style("opacity",0)


    if(IS_PHONE()){
      svg.append("circle")
        .attr("id", "personInnerCircle")
        .attr("class", "stepPerson")
        .attr("r", .3*window.innerWidth)
        .attr("cx", .5*window.innerWidth - 27)
        .attr("cy", .5*window.innerHeight - .235*window.innerWidth + 22)
        .style("fill", "none")
        .style("stroke", "#000")
        .attr("stroke-width", "3px")
      svg.append("circle")
        .attr("id", "personOuterCircle")
        .attr("class", "stepPerson")
        .attr("r", .3*window.innerWidth)
        .attr("cx", .5*window.innerWidth - 27)
        .attr("cy", .5*window.innerHeight - .235*window.innerWidth + 22)
        .style("fill", "none")
        .style("stroke", "#ffffff")
        .attr("stroke-width", "0px")

    }else{
          var personcx = (getSize() == "desktop") ? 221 : getIntroChartWidth()*.5 +21
    svg.append("circle")
      .attr("id", "personInnerCircle")
      .attr("class", "stepPerson")
      .attr("r", 163)
      .attr("cx", personcx)
      .attr("cy", 311)
      .style("fill", "none")
      .style("stroke", "#000")
      .attr("stroke-width", "3px")
    svg.append("circle")
      .attr("id", "personOuterCircle")
      .attr("class", "stepPerson")
      .attr("r", 166)
      .attr("cx", personcx)
      .attr("cy", 311)
      .style("fill", "none")
      .style("stroke", "#ffffff")
      .attr("stroke-width", "3px")

    }


      dHigh = twoDotData[0]
      dLow = twoDotData[1]
      dInt = twoDotData[2]

    svg.selectAll(".introAxis")
      .data([0,1,2,3,4])
      .enter()
      .append("line")
      .attr("class", d => "introAxis step0 ia" + d)
      .style("fill","none")
      .style("stroke","#9d9d9d")
      .attr("stroke-width","2px")
      .attr("stroke-dasharray", d=> (d==4) ? "" : 12)
      .attr("x1", d => introX(d))
      .attr("x2", d => introX(d))
      .attr("y1", introY(100))
      .attr("y2", introY(100))

    var introDotR = (IS_PHONE()) ? 8 : 13
    svg.selectAll(".dotInt")
      .data([1,2,3])
      .enter()
      .append("circle")
      .attr("class",d => "dotInt step0 di" + d )
      .style("fill","#fdbf11")
      .style("stroke","#000")
      .attr("stroke-width","4px")
      .attr("r",introDotR)
      .attr("cx", introX(1) )
      .attr("cy", introY(dInt.e1) )
      .style("opacity",0)

    svg.selectAll(".dotHigh")
      .data([0,1,2,3,4])
      .enter()
      .append("circle")
      .attr("class",d => "dotHigh step0 dh" + d )
      .style("fill","#1696d2")
      .style("stroke","none")
      .attr("r",introDotR)
      .attr("cx", introX(0) )
      .attr("cy", introY(dHigh.e0) )
      .style("opacity",0)


    svg.selectAll(".dotLow")
      .data([0,1,2,3,4])
      .enter()
      .append("circle")
      .attr("class",d => "dotLow step0 dl" + d )
      .style("fill","#fdbf11")
      .style("stroke","none")
      .attr("r",introDotR)
      .attr("cx", introX(0) )
      .attr("cy", introY(dLow.e0) )
      .style("opacity",0)

    svg.selectAll(".arrowHigh")
      .data([0,1,2,3])
      .enter()
      .append("path")
      .attr("class", d => "introArrow step0 arrowHigh arrow" + d )
      .attr("d", function(d){
        var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(dHigh["e" + d]),
            introY(dHigh["e" + (d+1)])
          )
        return "M " +
        p[0] + 
        " " +
        p[1]
      })
      .style("fill", "none")
      .style("stroke", "black")
      .attr("stroke-width", "2px")
      .style("opacity",0)
      .attr("marker-end","url(#arrowHead)")

    svg.selectAll(".arrowLow")
      .data([0,1,2,3])
      .enter()
      .append("path")
      .attr("class", d => "introArrow step0 arrowLow arrow" + d )
      .attr("d", function(d){
        var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(dLow["e" + d]),
            introY(dLow["e" + (d+1)])
          )
        return "M " +
        p[0] + 
        " " +
        p[1]
      })
      .style("fill", "none")
      .style("stroke", "black")
      .attr("stroke-width", "2px")
      .style("opacity",0)
      .attr("marker-end","url(#arrowHead)")

    svg.selectAll(".arrowInt")
      .data([1,2,3])
      .enter()
      .append("path")
      .attr("class", d => "introArrowInt arrowInt step0 arrow" + d )
      .attr("d", function(d){
        var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(dInt["e" + d]),
            introY(dInt["e" + (d+1)])
          )
        return "M " +
        p[0] + 
        " " +
        p[1]
      })
      .style("fill", "none")
      .style("stroke", "black")
      .attr("stroke-width", "2px")
      .style("opacity",0)
      .attr("marker-end","url(#arrowHead)")



    svg.selectAll(".swarmDot")
      .data(introData)
      .enter()
      .append("circle")
      .attr("class","swarmDot")
      .attr('cx', introX(-1))
      .attr('cy', d => introY(d.earnings0))
      .style("fill", d => (d.dotColor == "b") ? "#1696d2" : "#fdbf11")
      .attr("stroke-width","0px")
      .style("stroke","#000000")
      .attr("r", SWARM_DOT_R)


var introArcEls = svg.selectAll(".swarmArc")
    .data(introData.filter(d => d.dotColor == "yI"))
    // .each(function(d){
    .enter()
    .append("path")
  .attr("class",function(){
// console.log(d)
return 'swarmArc'
})
.attr('d', function (d) {
var startY = introY(d.earnings4),
endY = introY(d.earnings4Int),
startX = introX(4) + (2*SWARM_DOT_R*d.earnings4Ind) + 10,
endX = introX(4) + (2*SWARM_DOT_R*d.earnings4IntInd) + 10,
distY = startY - endY

return [
'M',
startX , startY,    
'C',
(startX + distY*X_BEZIER_CONST_INTRO), (startY + distY*Y_BEZIER_CONST_INTRO),
(endX + distY*X_BEZIER_CONST_INTRO), (endY - distY*Y_BEZIER_CONST_INTRO),
endX, endY
]
.join(' ');
})
.style("fill", "none")
.attr("stroke", "#000000")
.attr("stroke-width", "1px")
// .attr("marker-end","url(#arrowHead)")
.style("opacity",0)
// .attr("data-length",0)

d3.selectAll(".swarmArc").each(function(){
  var l = this.getTotalLength()

  d3.select(this)
  .transition()
  .duration(0)
  .attr("stroke-dasharray", l + " " + l)
.attr("stroke-dashoffset", l)
.attr("data-length",l)

})

svg.selectAll(".startArcDot")
.data(introData.filter(d => d.dotColor == "yI"))
.enter()
.append("circle")
.attr("class","startArcDot")
.attr("cx", d => introX(4) + (2*SWARM_DOT_R*d.earnings4Ind) + 10)
.attr("cy", d => introY(d.earnings4))
// .transition()
// .duration(INTRO_DUR_TWODOT)
// .delay(INTRO_DEL_TWODOT)
// .attr("stroke-width",0)
// .style("stroke","#ff0000")
.style("stroke", "none")
.style("fill", "#fdbf11")
.style("opacity",0)
.attr("r", SWARM_DOT_R)





  };

  function pointAlongLine(x1,x2,y1,y2){
    let len = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)),
        dx = (x2-x1) / len
        dy = (y2-y1) / len

    let dist = 13+5
    let x3 = x1 + dist * dx
    let y3 = y1 + dist * dy


    return [x3,y3]





    // (y3-y1)/(x3-x1) = (y2-y1)/(x2-x1)
    // sqrt((y3-y1)^2 + (x3-x1)^2) = dist


  }

  function drawIntroAxis(ind){
    var introY = getIntroY()
    d3.select(".ia" + ind)
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",1)
      .transition()
      .delay(function(){
        var scalar = (ind > 2) ? ind-2 : ind;
        return scalar*(2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT)
      })
      .duration(INTRO_DUR_TWODOT/2)
      .attr("y2", introY(-100))
    if(ind == 4){
      d3.select("#introAxisLabel text")
        .transition()
        .delay(function(){
          var scalar = (ind > 2) ? ind-2 : ind;
          return scalar*(2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT)
        })
        .duration(INTRO_DUR_TWODOT/2)
        .style("opacity",1)
    }

  }
  function hideArrow(ind, isInt){
       var introX = getIntroX(),
        introY = getIntroY()

    var s = 0.7
    var selector = (isInt) ? ".arrowInt.arrow" + ind : ".introArrow.arrow" + ind
    d3.selectAll(selector)
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",0)
      .attrTween("d", function(d){
        var dat = d3.select(this).classed("arrowHigh") ? dHigh : (isInt) ? dInt : dLow
        var previous = d3.select(this).attr('d');
          var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(dat["e" + d]),
            introY(dat["e" + (d+1)])
          )
        var current = "M " +
        p[0] + 
        " " +
        p[1]
        return d3.interpolatePath(previous, current);
      })
  }

  function drawArrow(ind, isInt){
    var introX = getIntroX(),
        introY = getIntroY()

    var s = 0.7
    var scooth = (IS_PHONE()) ? 3 : 15;
    var selector = (isInt) ? ".arrowInt.arrow" + ind : ".introArrow.arrow" + ind
    d3.selectAll(selector)
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",0)
      .attrTween("d", function(d){
          var dat = (d3.select(this).classed("arrowHigh") ? dHigh : (isInt) ? dInt : dLow)
          var previous = d3.select(this).attr('d');
          var ind = (isInt) ? d-1 : d;
          var y1 = (isInt && d == 1) ? dLow["e" + d] : dat["e" + ind]
          var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(y1),
            introY(dat["e" + (ind+1)])
          )
        var current = "M " +
        p[0] + 
        " " +
        p[1]
        return d3.interpolatePath(previous, current);
      })
      .transition()
      .ease(d3.easeLinear)
      .delay(function(){
        var scalar = (ind > 1) ? ind-2 : ind;
        if (isInt) return ((ind-1)*2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT + RESET_DURATION*2 + 200)
        else return scalar*(2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT)
      })
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",1)
      .duration(INTRO_DUR_TWODOT)
      .style("opacity",1)
      .attrTween("d", function(d){
          var dat = (d3.select(this).classed("arrowHigh") ? dHigh : (isInt) ? dInt : dLow)
          var previous = d3.select(this).attr('d');
          var ind = (isInt) ? d-1 : d;
          var y1 = (isInt && d == 1) ? dLow["e" + d] : dat["e" + ind]
          var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(y1),
            introY(dat["e" + (ind+1)])
          )
        var current = "M " +
        p[0] + 
        " " +
        p[1] +
        " L " +
        (introX(+d + 0.7) - 13 - scooth) + 
        " " +
        introY(dat["e" + (ind+1)])
        return d3.interpolatePath(previous, current);
      })
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
      .delay(INTRO_DEL_TWODOT)
        .attrTween('d', function(d){
          var dat = (d3.select(this).classed("arrowHigh") ? dHigh : (isInt) ? dInt : dLow)
          var previous = d3.select(this).attr('d');
          var ind = (isInt) ? d-1 : d;
          var y1 = (isInt && d == 1) ? dLow["e" + d] : dat["e" + ind]
          var p = pointAlongLine(
            introX(d),
            introX(+d + .7),
            introY(y1),
            introY(dat["e" + (ind+1)])
          )
        var current = "M " +
          p[0] + 
          " " +
          p[1] +
          " L " +
          (introX(+d + 0.7) - 13 - scooth) + 
          " " +
          introY(dat["e" + (ind+1)]) +
          " L " +
          (introX(+d + 1) - 13 - scooth) + 
          " " +
          introY(dat["e" + (ind+1)])


          return d3.interpolatePath(previous, current);
        })


  }

  /**
  * setupSections - each section is activated
  * by a separate function. Here we associate
  * these functions to the sections based on
  * the section's index.
  *
  */
  var setupSections = function (introData,twoDotData, exploreData) {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = function(trigger){ animatePerson() };
    activateFunctions[1] = function(trigger){ startTwoDots(twoDotData,trigger) };
    activateFunctions[2] = function(trigger){ moveTwoDots(twoDotData,trigger) };
    activateFunctions[3] = function(trigger){ interveneTwoDots(twoDotData,trigger) };
    activateFunctions[4] = function(trigger){ showWideText(trigger) };
    activateFunctions[5] = function(trigger){ showManyDots(introData, trigger) };
    activateFunctions[6] = function(trigger){ interveneManyDots(introData, trigger) };
    activateFunctions[7] = function(trigger){ annotateManyDots(introData, trigger) };
    activateFunctions[8] = function(trigger){ showScenarioMenus(exploreData, trigger) };
    activateFunctions[9] = function(trigger){ lastSection(trigger);}
    activateFunctions[10] = function(trigger){ lastSection(trigger);}
  };

  /**
  * ACTIVATE FUNCTIONS
  *
  * These will be called their
  * section is scrolled to.
  *
  * General pattern is to ensure
  * all content for the current section
  * is transitioned in, while hiding
  * the content for the previous section
  * as well as the next section (as the
  * user may be scrolling up or down).
  *
  */


  var highestIndex = 0;
  /**
  * showTitle - initial title
  *
  * hides: count title
  * (no previous step to hide)
  * shows: intro title
  *
  */




  function startTwoDots(twoData, trigger){
    // hideChooseSchool();
    var introX = getIntroX(),
        introY = getIntroY()

    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)

    d3.selectAll(".dotHigh")
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",1)
      .attr("cx", introX(0))
      .attr("cy", d => introY(dHigh.e0))
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",1)
      .transition()
      .duration(INTRO_DUR_TWODOT)
        .attr("cx", d => (d > 0) ? introX(.7) : introX(0))
        .attr("cy", d => (d > 0) ? introY(dHigh.e1) : introY(dHigh.e0))
        .transition()
        .ease(d3.easeLinear)
        .duration(INTRO_DUR_TWODOT)
        .delay(INTRO_DEL_TWODOT)
          .attr("cx", d => (d > 0) ? introX(1) : introX(0))
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
            .attr("cx", d => (d > 1) ? introX(1.7) : introX(d))
            .attr("cy", d => (d > 1) ? introY(dHigh.e2) : introY(dHigh["e" + d]))
            .transition()
            .duration(INTRO_DUR_TWODOT)
            .delay(INTRO_DEL_TWODOT)
              .attr("cx", d => (d > 1) ? introX(2) : introX(d))

    d3.selectAll(".dotLow")
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",1)
      .attr("cx", introX(0))
      .attr("cy", d => introY(dLow.e0))
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",1)
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
        .attr("cx", d => (d > 0) ? introX(.7) : introX(0))
        .attr("cy", d => (d > 0) ? introY(dLow.e1) : introY(dLow.e0))
        .transition()
        .ease(d3.easeLinear)
        .duration(INTRO_DUR_TWODOT)
        .delay(INTRO_DEL_TWODOT)
          .attr("cx", d => (d > 0) ? introX(1) : introX(0))
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
            .attr("cx", d => (d > 1) ? introX(1.7) : introX(d))
            .attr("cy", d => (d > 1) ? introY(dLow.e2) : introY(dLow["e" + d]))

            .transition()
            .ease(d3.easeLinear)
            .duration(INTRO_DUR_TWODOT)
            .delay(INTRO_DEL_TWODOT)
              .attr("cx", d => (d > 1) ? introX(2) : introX(d))


    drawArrow(0, false)
    drawArrow(1, false)
    hideArrow(2, false)
    hideArrow(3, false)
    hideArrow(1, true)
    hideArrow(2, true)
    hideArrow(3, true)
    drawIntroAxis(0)
    drawIntroAxis(1)
    drawIntroAxis(2)
    // drawArrow(2)

  }
  function moveTwoDots(twoData, trigger){
    var introX = getIntroX(),
        introY = getIntroY()
    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)

    d3.select("#upArrowInt")
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",0)

    d3.selectAll(".dotHigh")
      .transition()
      .style("opacity",1)
      .duration(RESET_DURATION)
      .attr("cy", d => (d > 1) ? introY(dHigh.e2) : introY(dHigh["e" + d]))
      .attr("cx", d => (d > 1) ? introX(2) : introX(d))
      .style("opacity",1)
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
        .attr("cx", d => (d > 2) ? introX(2.7) : introX(d))
        .attr("cy", d => (d > 2) ? introY(dHigh.e3) : introY(dHigh["e" + d]))
        .transition()
        .ease(d3.easeLinear)
        .duration(INTRO_DUR_TWODOT)
        .delay(INTRO_DEL_TWODOT)
          .attr("cx", d => (d > 2) ? introX(3) : introX(d))
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
            .attr("cx", d => (d > 3) ? introX(3.7) : introX(d))
            .attr("cy", d => (d > 3) ? introY(dHigh.e4) : introY(dHigh["e" + d]))
            .transition()
            .duration(INTRO_DUR_TWODOT)
            .delay(INTRO_DEL_TWODOT)
              .attr("cx", d => (d > 3) ? introX(4) + 20 : introX(d))

    d3.selectAll(".dotLow")
      .transition()
      .style("opacity",1)
      .duration(RESET_DURATION)
      .attr("cy", d => (d > 1) ? introY(dLow.e2) : introY(dLow["e" + d]))
      .attr("cx", d => (d > 1) ? introX(2) : introX(d))
      .transition()
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
        .attr("cx", d => (d > 2) ? introX(2.7) : introX(d))
        .attr("cy", d => (d > 2) ? introY(dLow.e3) : introY(dLow["e" + d]))
        .transition()
        .ease(d3.easeLinear)
        .duration(INTRO_DUR_TWODOT)
        .delay(INTRO_DEL_TWODOT)
          .attr("cx", d => (d > 2) ? introX(3) : introX(d))
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
            .attr("cx", d => (d > 3) ? introX(3.7) : introX(d))
            .attr("cy", d => (d > 3) ? introY(dLow.e4) : introY(dLow["e" + d]))
            .transition()
            .ease(d3.easeLinear)
            .duration(INTRO_DUR_TWODOT)
            .delay(INTRO_DEL_TWODOT)
              .attr("cx", d => (d > 3) ? introX(4) + 20 : introX(d))

    d3.selectAll(".dotInt")
      .transition()
      .duration(RESET_DURATION)
      .attr("cy", introY(dLow["e1"]))
      .attr("cx", introX(1))
      .style("opacity",0)

    d3.selectAll("#introAxisLabel")
      .transition()
      .style("opacity",1)

    drawArrow(2, false)
    drawArrow(3, false)
    hideArrow(1, true)
    hideArrow(2, true)
    hideArrow(3, true)
    drawIntroAxis(3)
    drawIntroAxis(4)
  }

  function interveneTwoDots(twoData, trigger){
    var introX = getIntroX(),
        introY = getIntroY()
    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)

    d3.select("#upArrowInt")
      .transition()
      .duration(INTRO_DUR_TWODOT)
      .style("opacity",1)

    d3.selectAll(".introAxis")
      .transition()
      .style("opacity",1)
      .attr("y2", introY(-100))
    d3.selectAll("#introAxisLabel")
      .transition()
      .style("opacity",1)
    var scooth = (IS_PHONE()) ? 3 : 15;
    for(var i = 0; i < 5; i++){
      var finalDotOpacity = (i < 2 ) ? 1 : .4
      var finalArrowOpacity = (i < 1) ? 1 : .3
      if(i != 4){
        d3.select(".arrowLow.arrow" + i)
          .transition()
          .duration(RESET_DURATION)
          .style("opacity",1)
          .attrTween("d", function(d){
            var dat = dLow;
            var previous = d3.select(this).attr('d');
            var p = pointAlongLine(
              introX(d),
              introX(+d + .7),
              introY(dat["e" + d]),
              introY(dat["e" + (d+1)])
            )
          var current = "M " +
            p[0] + 
            " " +
            p[1] +
            " L " +
            (introX(+d + 0.7) - 13 - scooth) + 
            " " +
            introY(dat["e" + (d+1)]) +
            " L " +
            (introX(+d + 1) - 13 - scooth) + 
            " " +
            introY(dat["e" + (d+1)])   
            return d3.interpolatePath(previous, current);
          })
          .transition()
          .duration(INTRO_DUR_TWODOT)
          .style("opacity",finalArrowOpacity)
        d3.select(".arrowHigh.arrow" + i)
          .transition()
          .duration(RESET_DURATION)
          .style("opacity",1)
          .attrTween("d", function(d){
            var dat = dHigh;
            var previous = d3.select(this).attr('d');
            var p = pointAlongLine(
              introX(d),
              introX(+d + .7),
              introY(dat["e" + d]),
              introY(dat["e" + (d+1)])
            )
          var current = "M " +
            p[0] + 
            " " +
            p[1] +
            " L " +
            (introX(+d + 0.7) - 13 - scooth) + 
            " " +
            introY(dat["e" + (d+1)]) +
            " L " +
            (introX(+d + 1) - 13 - scooth) + 
            " " +
            introY(dat["e" + (d+1)])   
            return d3.interpolatePath(previous, current);
          })
          .transition()
          .duration(INTRO_DUR_TWODOT)
          .style("opacity",1)
        }
        d3.select(".dotLow.dl" + i)
          .transition()
          .duration(RESET_DURATION)
          .attr("cy", d => introY(dLow["e" + d]))
          .attr("cx", d => (d > 3) ? introX(4) + 20 : introX(d))
          .transition()
          .duration(INTRO_DUR_TWODOT)
          .style("opacity",finalDotOpacity)
        d3.select(".dotHigh.dh" + i)
          .transition()
          .duration(RESET_DURATION)
          .attr("cy", d => introY(dHigh["e" + d]))
          .attr("cx", d => (d > 3) ? introX(4) + 20 : introX(d))
          .transition()
          .duration(INTRO_DUR_TWODOT)
          .style("opacity",1)
    }

    d3.selectAll(".dotInt")
      .transition()
      .duration(RESET_DURATION)
      .attr("cy", d => (d == 1) ? introY(dLow.e1) : introY(dInt["e" + (d-1)]))
      .attr("cx", d => introX(d))
      .style("opacity",0)
      .transition()
      .ease(d3.easeLinear)
      .duration(RESET_DURATION)
      .delay(function(d){
        // var scalar = (ind > 2) ? ind-2 : ind;
        return ((d-1)*2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT + RESET_DURATION*2)
      })
      .style("opacity",1)
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
          .attr("cx", d => introX(+d + .5))
          .attr("cy", d => introY(dInt["e" + d]))
          // .style("opacity",1)
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
          .attr("cx", d => (d > 2) ? introX(4) + 20 : introX(d+1))
          //   .attr("cx", d => (d > 3) ? introX(3.7) : introX(d))
          //   .attr("cy", d => (d > 3) ? introY(dLow.e4) : introY(dLow["e" + d]))
          //   .transition()
          //   .ease(d3.easeLinear)
          //   .duration(INTRO_DUR_TWODOT)
          //   .delay(INTRO_DEL_TWODOT)
          //     .attr("cx", d => (d > 3) ? introX(4) + 20 : introX(d))
    // d3.select(".arrowLow.arrow2").transition().duration(INTRO_DUR_TWODOT).style("opacity",.3)
    // d3.select(".arrowLow.arrow3").transition().duration(INTRO_DUR_TWODOT).style("opacity",.3)
    // d3.select(".dotLow.dl2").transition().duration(INTRO_DUR_TWODOT).style("opacity",.4)
    // d3.select(".dotLow.dl3").transition().duration(INTRO_DUR_TWODOT).style("opacity",.4)
    // d3.select(".dotLow.dl4").transition().duration(INTRO_DUR_TWODOT).style("opacity",.4)
    drawArrow(1, true)
    drawArrow(2, true)
    drawArrow(3, true)
    // d3.select("#chapterLabelContainer").style("background","white")

  }
  function clearAll(){
    var introX = getIntroX(),
    introY = getIntroY()
    d3.selectAll(".step0")
    .transition()
    .style("opacity",0)
    d3.selectAll(".swarmDot")
    .transition()
    .duration(0)
    .attr("cx", introX(-1))
    .attr("cy", d => introY(d.earnings0))
    d3.select("#upArrowInt")
    .transition()
    .style("opacity",0)
    d3.selectAll(".startArcDot")
    .transition()
    .duration(SWARM_DOT_DUR)
    .style("opacity",0)
       d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0) 
  }
  function showWideText(trigger){
    clearAll();
    // d3.select("#chapterLabelContainer").style("background","none")
  }

  function showManyDots(introData, trigger){
    var introX = getIntroX(),
        introY = getIntroY()
    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)
    d3.select("#upArrowInt")
      .transition()
      .duration(RESET_DURATION)
      .style("opacity",0)

    d3.selectAll(".introAxis")
      .transition()
      .style("opacity",1)
      .attr("y2", introY(-100))
    d3.selectAll("#introAxisLabel")
      .transition()
      .style("opacity",1)

    d3.selectAll(".swarmDot")
      .transition()
      .duration(RESET_DURATION)
      .attr("cx", introX(-1))
      .attr("cy", d => introY(d.earnings0))
      .attr("stroke-width","0px")
      .style("stroke","#000000")
      .attr("r",SWARM_DOT_R)
      .transition()
      .duration(SWARM_DOT_DUR)
      .delay(d => d.t0)
      // .ease(d3.easeLinear)
            .attr("cx", introX(0))
        .attr("cy", d => introY(d.earnings1))
        .transition()
        .duration(SWARM_DOT_DUR)  
        .attr("cx", introX(1))
        .attr("cy", d => introY(d.earnings1))
        .transition()
        .duration(SWARM_DOT_DUR)
        // .ease(d3.easeLinear)
          .attr("cx", introX(2))
          .attr("cy", d => introY(d.earnings2))
          .transition()
          .duration(SWARM_DOT_DUR)
          // .ease(d3.easeLinear)
            .attr("cx", introX(3))
            .attr("cy", d => introY(d.earnings3))
            .transition()
            .duration(SWARM_DOT_DUR*2)
            // .ease(d3.easeLinear)
              .attr("cx", d => introX(4) + (2*SWARM_DOT_R*d.earnings4Ind) + 10)
              .attr("cy", d => introY(d.earnings4))

    // d3.select("#chapterLabelContainer").style("background","white")

  }

  function interveneManyDots(introData, trigger){
    var introX = getIntroX(),
        introY = getIntroY()
    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)
d3.selectAll(".startArcDot")
  .transition()
  .duration(RESET_DURATION)
  .style("opacity",0)

d3.selectAll(".swarmArc").each(function(){
  var l = d3.select(this).attr("data-length")

  d3.select(this)
  .transition()
  .duration(RESET_DURATION)
  .attr("stroke-dasharray", l + " " + l)
  .attr("stroke-dashoffset", l)
})


    d3.select("#selectScenarioContainer")
      .transition()
      .style("right","-700px")

d3.selectAll(".startArcDot")
  .transition()
  .duration(SWARM_DOT_DUR)
  .style("opacity",0)

    d3.selectAll(".introAxis")
      .transition()
      .style("opacity",1)
      .attr("y2", introY(-100))
    d3.selectAll("#introAxisLabel")
      .transition()
      .style("opacity",1)

    d3.select("#upArrowInt")
      .transition()
      .duration(SWARM_DOT_DUR)
      .delay(1000)
      .style("opacity",1)

    d3.selectAll(".swarmDot")
      .transition()
      .duration(RESET_DURATION)
      .attr("cx", introX(-1))
      .attr("cy", d => introY(d.earnings0))
      .style("opacity",1)
      .transition()
      .duration(SWARM_DOT_DUR)
      .delay(d => d.t0)
      // .ease(d3.easeLinear)
        .attr("cx", introX(0))
        .attr("cy", d => introY(d.earnings1))
        .transition()
        .duration(SWARM_DOT_DUR)  
        .attr("cx", introX(1))
        .attr("cy", d => introY(d.earnings1))
        .transition()
        .duration(RESET_DURATION)
        .attr("stroke-width", d => (d.dotColor == "yI") ? "3px" : "0px")
        .transition()
        .duration(SWARM_DOT_DUR)
        // .ease(d3.easeLinear)
          .attr("cx", introX(2))
          .attr("cy", d => (d.dotColor == "yI") ?  introY(d.earnings2Int) : introY(d.earnings2))
          .transition()
          .duration(SWARM_DOT_DUR)
          // .ease(d3.easeLinear)
            .attr("cx", introX(3))
            .attr("cy", d => (d.dotColor == "yI") ?  introY(d.earnings3Int) : introY(d.earnings3))
            .transition()
            .duration(SWARM_DOT_DUR*2)
            // .ease(d3.easeLinear)
              .attr("cx", d => introX(4) + (2*SWARM_DOT_R*d.earnings4IntInd) + 10)
              .attr("cy", d => (d.dotColor == "yI") ?  introY(d.earnings4Int) : introY(d.earnings4))
  }

  function annotateManyDots(introData, trigger){
    d3.selectAll(".stepPerson")
      .transition()
      .ease(d3.easeLinear)
      .style("opacity",0)
    d3.select("#selectScenarioContainer")
      .transition()
      .style("right","-700px")
    
    var introX = getIntroX(),
        introY = getIntroY()

    d3.selectAll(".introAxis")
      .transition()
      .style("opacity",1)
      .attr("y2", introY(-100))
    d3.selectAll("#introAxisLabel")
      .transition()
      .style("opacity",1)

    d3.select("#upArrowInt")
      .transition()
      .style("opacity",0)

    d3.selectAll(".swarmDot")
      .transition()
      .duration(SWARM_DOT_DUR)
    // .ease(d3.easeLinear)
      .attr("cx", d => introX(4) + (2*SWARM_DOT_R*d.earnings4IntInd) + 10)
      .attr("cy", d => (d.dotColor == "yI") ?  introY(d.earnings4Int) : introY(d.earnings4))
      .attr("stroke-width", d => (d.dotColor == "yI") ? "3px" : "0px")
      // .style("fill", d => (d.dotColor == "yI") ? "#" : 0)
      .transition()
      // .delay()
      .style("opacity", d => (d.dotColor == "yI") ? 1 : .1)
d3.selectAll(".startArcDot")
  .transition()
  .duration(SWARM_DOT_DUR)
  .style("opacity",1)


d3.selectAll(".swarmArc").each(function(D,I){
  var l = d3.select(this).attr("data-length")

  d3.select(this)
  .transition()
  // .duration()
.attr("stroke-dashoffset", l)
.style("opacity",1)
.transition()
.ease(d3.easeLinear)
.delay(function(d,i) {  return I*10 + 1200 })
.duration(1000)
.attr("stroke-dashoffset", 0)
// .attrTween("stroke-dashoffset", function(d,i){
//   // console.log(i)
//   var arcLength = d3.select(this).attr("data-length")
//   return customInterpolateIntro(this,arcLength)
// })

})






  }


function customInterpolateIntro(arc, arcLength){
    // console.log(a,b)
    return function(t){
        // console.log(arc, dot, t/LONG_DURATION, t)
        // console.log(t)
        return arcLength - t*arcLength

    }

}



  function showScenarioMenus(exploreData, trigger){

d3.selectAll(".swarmArc").each(function(){
  var l = this.getTotalLength()

  d3.select(this)
  .transition()
  .duration(RESET_DURATION)
  .attr("stroke-dasharray", l + " " + l)
  .attr("stroke-dashoffset", l)
})



    var introX = getIntroX(),
        introY = getIntroY()
    d3.select("#selectScenarioContainer")
      .transition()
      .style("right","0px")
    clearAll()
  }

  function lastSection(){
    d3.select("#selectScenarioContainer")
      .transition()
      .style("right","-700px")
  }

  /**
  * DATA FUNCTIONS
  *
  * Used to coerce the data into the
  * formats we need to visualize
  *
  */

  /**
  * activate -
  *
  * @param index - index of the activated section
  */
  chart.activate = function (index) {
    console.log(index)
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
    if(i == -1){
      // activateFunctions[0]("scroll")
      animatePerson()
    }else{
      showNavDot(i + 1)
      activateFunctions[i]("scroll");
    }
    });
    lastIndex = activeIndex;
  };
  return chart;
};

function showNavDot(ind){
  var dotSel;
  if(ind >= 10){
    if(ind == 10){
      d3.select("#chapterHeader").text("Section 3")
      d3.select("#chapterLabel").text("WRAP-UP")
      dotSel = 3
    }
    if(ind == 11){
      d3.select("#chapterHeader").text("Section 4")
      d3.select("#chapterLabel").text("ABOUT THE PROJECT")  
      dotSel = 4
    }
    if(getSize() == "desktop"){
      d3.select("#chapterLabelContainer")
        .style("width","100vw")
        .style("background","rgba(255,255,255,.7)")
    }else{
      d3.select("#chapterLabelContainer")
        .style("width","100%")
        .style("background","rgba(255,255,255,.7)")
    }
  }else{
    if(ind == 9){
      d3.select("#chapterHeader").text("Section 2")
      d3.select("#chapterLabel").text("THE SCENARIOS")
      dotSel = 2
    }else{
      d3.select("#chapterHeader").text("Section 1")
      d3.select("#chapterLabel").text("INTRODUCTION") 
      dotSel = 1
    }
    if(getSize() == "desktop" && ind == 5){
      console.log("Asdf")
      d3.select("#chapterLabelContainer")
        .style("width","100vw")
        .style("background","rgba(255,255,255,.7)")
    }
    else if(getSize() == "desktop" || ind == 9){
      var clw;
      if (ind == 9){
        if(window.innerWidth < 1284) clw = "510px"
        else clw = (window.innerWidth - 660)  + "px"
      }
      else{ clw = "50vw" }
      d3.select("#chapterLabelContainer")
        .style("width",clw)
        .style("background","rgba(255,255,255,.7)")
    }else{
      d3.select("#chapterLabelContainer")
        .style("width","330px")
        .style("background","none")
    }
  }
  d3.selectAll(".scrollNavEl").classed("active",false)
  d3.select("#sn" + dotSel).classed("active", true)

}
function animatePerson(){
  showNavDot(1)
  // console.log(activeIndex)
  d3.selectAll(".step0")
    .transition()
    .duration(RESET_DURATION)
    .style("opacity",0)



if(IS_PHONE()){
  d3.select("#personInnerCircle")
    .transition()
    .duration(RESET_DURATION)
    .attr("r", .3*window.innerWidth)
    .attr("stroke-width", "3px")
    .style("opacity",1)
    .transition()
    .duration(1200)
    .attr("r",.015*window.innerWidth)
    .attr("stroke-width",.015*window.innerWidth*2 + "px")
  d3.select("#personOuterCircle")
    .transition()
    .duration(RESET_DURATION)
    .attr("r", .3*window.innerWidth)
    .attr("stroke-width", "0px")
    .style("opacity",1)
    .transition()
    .duration(1200)
      .attr("r",.32*window.innerWidth)
      .attr("stroke-width", (.6*window.innerWidth) + "px")
      .transition()
      .duration(10)
        .style("opacity",0)
}else{
    d3.select("#personInnerCircle")
    .transition()
    .duration(RESET_DURATION)
    .attr("r", 163)
    .attr("stroke-width", "3px")
    .style("opacity",1)
    .transition()
    .duration(1200)
    .attr("r",11.5)
    .attr("stroke-width","23px")
  d3.select("#personOuterCircle")
    .transition()
    .duration(RESET_DURATION)
    .attr("r", 166)
    .attr("stroke-width", "3px")
    .style("opacity",1)
    .transition()
    .duration(1200)
      .attr("r",125)
      .attr("stroke-width", "200px")
      .transition()
      .duration(10)
        .style("opacity",0)
}


  d3.select("#person")
    .transition()
    .duration(RESET_DURATION)
    .style("opacity",1)
    .transition()
    .delay(1200)
    .duration(10)
      .style("opacity",0)

  d3.select(".pathImg.pathGrey")
    .transition()
    .delay(1210)
    .duration(900)
      .style("opacity",1)
  d3.select(".pathImg.pathBlue")
    .transition()
    .delay(1910)
    .duration(900)
      .style("opacity",1)
  d3.select(".pathImg.pathYellow")
    .transition()
    .delay(2610)
    .duration(900)
      .style("opacity",1)
}

/**
* display - called once data
* has been loaded.
* sets up the scroller and
* displays the visualization.
*
* @param data - loaded tsv data
*/
// var scroll;
function display(rawData) {
  if(getInternetExplorerVersion() != -1){
    IS_IE = true;
  }
  // create a new plot and
  // display it
  var plot = scrollVis();
  var introMargin = getIntroChartMargins();

  d3.select('#narrativeVizContainer')
  .style("left", function(){
    if(IS_PHONE()){
      return ( (window.innerWidth - PHONE_VIS_WIDTH - introMargin.left - introMargin.right)*.5 ) + "px"
    }
    if(IS_MOBILE()){
      return ( (window.innerWidth - VIS_WIDTH - introMargin.left - introMargin.right)*.5 ) + "px"
    }else{
      return "inherit"
    }
  })
  .datum(rawData)
  .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  scroll.on('resized', function(){
    d3.select("#narrativeVizContainer svg").remove()
    d3.select("#exploreVChartContainer svg").remove()
    display(rawData)
  })

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    var offOpacity = (IS_MOBILE() || IS_PHONE()) ? 1 : .1
    d3.selectAll('.step')
      .style('opacity', function (d, i) {
        return (i === index) ? 1 : offOpacity;
      });
    // activate current section
    plot.activate(index);

  });

}


const dataFiles = ["data/intro.csv", "data/twoDots.csv", "data/explore.csv"];
const promises = [];

dataFiles.forEach(function(url, index) {
  promises.push(url.search(".csv") != -1 ? d3.csv(url) : d3.json(url))
});

Promise.all(promises)
  .then(function(data) {
    display(data)
  });
