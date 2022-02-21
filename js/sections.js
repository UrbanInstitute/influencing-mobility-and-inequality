

/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/
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
  var activeIndex = 0;


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
          dotLow = null

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


    svg.append("circle")
      .attr("id", "personInnerCircle")
      .attr("class", "stepPerson")
      .attr("r", 163)
      .attr("cx", 221)
      .attr("cy", 311)
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-width", 3)
    svg.append("circle")
      .attr("id", "personOuterCircle")
      .attr("class", "stepPerson")
      .attr("r", 166)
      .attr("cx", 221)
      .attr("cy", 311)
      .style("fill", "none")
      .style("stroke", "#ffffff")
      .style("stroke-width", 3)


      dHigh = twoDotData[0]
      dLow = twoDotData[1]
    // console.log(dHigh)


    svg.selectAll(".introAxis")
      .data([0,1,2,3,4])
      .enter()
      .append("line")
      .attr("class", d => "introAxis step0 ia" + d)
      .style("fill","none")
      .style("stroke","#000")
      .style("stroke-width",2)
      .attr("stroke-dasharray", d=> (d==4) ? "" : 12)
      .attr("x1", d => introX(d))
      .attr("x2", d => introX(d))
      .attr("y1", introY(100))
      .attr("y2", introY(100))


    svg.selectAll(".dotHigh")
      .data([0,1,2,3,4])
      .enter()
      .append("circle")
      .attr("class",d => "dotHigh step0 dh" + d )
      .style("fill","#1696d2")
      .style("stroke","none")
      .attr("r",13)
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
      .attr("r",13)
      .attr("cx", introX(0) )
      .attr("cy", introY(dLow.e0) )
      .style("opacity",0)

    svg.selectAll(".arrowHigh")
      .data([0,1,2,3,4])
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
      .style("stroke-width", 2)
      .style("opacity",0)
      .attr("marker-end","url(#arrowHead)")

    svg.selectAll(".arrowLow")
      .data([0,1,2,3,4])
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
      .style("stroke-width", 2)
      .style("opacity",0)
      .attr("marker-end","url(#arrowHead)")







      // .attr("height", 100)
  };

  function pointAlongLine(x1,x2,y1,y2){
    let len = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)),
        dx = (x2-x1) / len
        dy = (y2-y1) / len

    let dist = 13+5
    let x3 = x1 + dist * dx
    let y3 = y1 + dist * dy

console.log(x1,x2,y1,y2,dist,len)

    return [x3,y3]





    // (y3-y1)/(x3-x1) = (y2-y1)/(x2-x1)
    // sqrt((y3-y1)^2 + (x3-x1)^2) = dist


  }

  function drawIntroAxis(ind){
    var introY = getIntroY()
    d3.select(".ia" + ind)
      .transition()
      .delay(function(){
        var scalar = (ind > 2) ? ind-2 : ind;
        return scalar*(2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT)
      })
      .duration(INTRO_DUR_TWODOT/2)
      .attr("y2", introY(-100))
  }

  function drawArrow(ind){
    var introX = getIntroX(),
        introY = getIntroY()

    var s = 0.7
    d3.selectAll(".introArrow.arrow" + ind)
      .transition()
      .ease(d3.easeLinear)
      .delay(function(){
        var scalar = (ind > 1) ? ind-2 : ind;
        return scalar*(2*INTRO_DUR_TWODOT + INTRO_DEL_TWODOT)
      })
      .style("opacity",1)
      // .transition()
      // .duration(INTRO_DUR_TWODOT)
      // // .delay(INTRO_DEL_TWODOT)
      // .attrTween("d", function(d){
      //   var dat = (d3.select(this).classed("arrowHigh") ? dHigh : dLow)
      //   var previous = d3.select(this).attr('d');
      //   var current = "M " +
      //   (introX(d) + 13 +5) + 
      //   " " +
      //   introY(dat["e" + d]) +
      //   " L " +
      //   (introX(+d + 0.7) - 13 - 15) + 
      //   " " +
      //   introY(dat["e" + d])
      //   return d3.interpolatePath(previous, current);
      // })
      // .transition()
      //   .duration(INTRO_DUR_TWODOT)
      //   .delay(INTRO_DEL_TWODOT)
      //   .attrTween('d', function(d){
      //     var dat = (d3.select(this).classed("arrowHigh") ? dHigh : dLow)
      //     var previous = d3.select(this).attr('d');
    
      //     console.log(d)
          
      //     var p = pointAlongLine(
      //         introX(+d + 0.7) - 13 - 15,
      //         introX(+d + 1),
      //         introY(dat["e" + d]),
      //         introY(dat["e" + (d+1)])
      //       )

      //     var current = "M " +
      //     (introX(d) + 13 +5) + 
      //     " " +
      //     introY(dat["e" + d]) +
      //     " L " +
      //     (introX(+d + 0.7) - 13 - 5) + 
      //     " " +
      //     introY(dat["e" + d]) +
      //     " L " +
      //     (p[0]) + 
      //     " " +
      //     p[1]

      //     return d3.interpolatePath(previous, current);
      //   })
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
      // .delay(INTRO_DEL_TWODOT)
      .attrTween("d", function(d){
        var dat = (d3.select(this).classed("arrowHigh") ? dHigh : dLow)
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
        (introX(+d + 0.7) - 13 - 15) + 
        " " +
        introY(dat["e" + (d+1)])
        return d3.interpolatePath(previous, current);
      })
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
      .delay(INTRO_DEL_TWODOT)
        .attrTween('d', function(d){
          var dat = (d3.select(this).classed("arrowHigh") ? dHigh : dLow)
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
          (introX(+d + 0.7) - 13 - 15) + 
          " " +
          introY(dat["e" + (d+1)]) +
          " L " +
          (introX(+d + 1) - 13 - 15) + 
          " " +
          introY(dat["e" + (d+1)])


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
    activateFunctions[0] = function(trigger){ startTwoDots(twoDotData,trigger) };
    activateFunctions[1] = function(trigger){ moveTwoDots(twoDotData,trigger) };
    activateFunctions[2] = function(trigger){ interveneTwoDots(twoDotData,trigger) };
    activateFunctions[3] = function(trigger){ showWideText(trigger) };
    activateFunctions[4] = function(trigger){ showManyDots(introData, trigger) };
    activateFunctions[5] = function(trigger){ interveneManyDots(introData, trigger) };
    activateFunctions[6] = function(trigger){ annotateManyDots(introData, trigger) };
    activateFunctions[7] = function(trigger){ showScenarioMenus(exploreData, trigger) };
    activateFunctions[9] = function(trigger){ lastSection(trigger);}
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
      .ease(d3.easeLinear)
      .style("opacity",1)
      .transition()
      .ease(d3.easeLinear)
      .duration(INTRO_DUR_TWODOT)
        .attr("cx", d => (d > 0) ? introX(.7) : introX(0))
        .transition()
        .ease(d3.easeLinear)
        .duration(INTRO_DUR_TWODOT)
        .delay(INTRO_DEL_TWODOT)
          .attr("cx", d => (d > 0) ? introX(1) : introX(0))
          .attr("cy", d => (d > 0) ? introY(dLow.e1) : introY(dLow.e0))
          .transition()
          .ease(d3.easeLinear)
          .duration(INTRO_DUR_TWODOT)
            .attr("cx", d => (d > 1) ? introX(1.7) : introX(d))
            .transition()
            .ease(d3.easeLinear)
            .duration(INTRO_DUR_TWODOT)
            .delay(INTRO_DEL_TWODOT)
              .attr("cx", d => (d > 1) ? introX(2) : introX(d))
              .attr("cy", d => (d > 1) ? introY(dLow.e2) : introY(dLow["e" + d]))


    drawArrow(0)
    drawArrow(1)
    drawIntroAxis(0)
    drawIntroAxis(1)
    drawIntroAxis(2)
    // drawArrow(2)

  }
  function moveTwoDots(twoData, trigger){
    console.log("Two dots more crossrorads -> lifetime earnings")
    var introX = getIntroX(),
        introY = getIntroY()

    d3.selectAll(".dotHigh")
      .transition()
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


    drawArrow(2)
    drawArrow(3)
    drawIntroAxis(3)
    drawIntroAxis(4)
  }

  function interveneTwoDots(twoData, trigger){
    console.log("Two dots intervention")
  }

  function showWideText(trigger){
    console.log("full wide text")
    d3.selectAll(".step0")
      .transition()
      .style("opacity",0)
  }

  function showManyDots(introData, trigger){
    console.log("lots dots")
  }

  function interveneManyDots(introData, trigger){
    console.log("intervention lots")
  }

  function annotateManyDots(introData, trigger){
    console.log("intervention show arrows/change")
  }
  function showScenarioMenus(exploreData, trigger){
    console.log("show scenario menus")
  }

  function lastSection(){
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
    activeIndex = index;
    console.log(index)
    var sign = (activeIndex - lastIndex) < 0 ? 1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
    activateFunctions[i]("scroll");
    });
    lastIndex = activeIndex;
  };
  return chart;
};



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

function animatePerson(){
  d3.select("#personInnerCircle")
    .transition()
    .duration(2200)
    .attr("r",11.5)
    .style("stroke-width",25)
  d3.select("#personOuterCircle")
    .transition()
    .duration(2200)
      .attr("r",125)
      .style("stroke-width", 200)
      .transition()
      .duration(10)
        .style("opacity",0)
  d3.select("#person")
    .transition()
    .delay(2200)
    .duration(10)
      .style("opacity",0)

  d3.select(".pathImg.pathGrey")
    .transition()
    .delay(2210)
    .duration(900)
      .style("opacity",1)
  d3.select(".pathImg.pathBlue")
    .transition()
    .delay(2910)
    .duration(900)
      .style("opacity",1)
  d3.select(".pathImg.pathYellow")
    .transition()
    .delay(3610)
    .duration(900)
      .style("opacity",1)
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
