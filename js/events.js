var dispatch = d3.dispatch("changeDistrict","changeLevel","changeSchool","changeSchoolTypes","active","resized","reset", "dataLoad", "showIntervention","resetIntervention");


function bindGlobalData(introData, twoDotData, exploreData){
    d3.select("#introDataContainer").datum(introData)
    d3.select("#exploreDataContainer").datum(exploreData)
    d3.select("#twoDotDataContainer").datum(twoDotData)
}

function closeOverlay(){
    phoneChartInd = 0;
    d3.select("#allOverlays")
        .transition()
        .duration(500)
        .style("opacity",0)
        .on("end", function(){
            d3.select(this)
                .style("z-index",-1)
            d3.select(".pickScenario.step").node().scrollIntoView()
        })
  d3.selectAll(".overlayContainer").classed("active",false)
  d3.selectAll(".overlayNavContainer").classed("active",false)

}
function showScenario(scenario, cardNum, trigger){
    console.log("asd")
    d3.select(".foo").node().value = scenario
    $(".foo").selectmenu("refresh")

// console.log(cardNum)
    buildExploreChart(scenario);
    if(+cardNum == 5) animateExploreChart(scenario);
    else resetExploreChart()
    if(typeof(cardNum) == "undefined") cardNum = 1;
    d3.select("#allOverlays")
        .style("z-index",20)
        .style("opacity",1)
    if(getActiveScenario() && getActiveScenario() != scenario){
        d3.select("#overlayImageTmp")
            .style("opacity",0)
            .style("background-image", "url('images/scenarios/" + scenario + ".jpg')")
            .style("display","block")
            .transition()
            .duration(2000)
            .style("opacity",1)
            .on("end", function(){
                d3.select(this)
                    .style("opacity",0)
                    .style("display","none")
                    .style("background-image","none")
            })
        d3.select("#overlayImage")
            .transition()
            .duration(1400)
            .style("opacity",0)
            .on("end", function(){
                d3.select(this)
                    .style("background-image", "url('images/scenarios/" + scenario + ".jpg')")
                    .style("display","block")
                    .style("opacity",1)
                d3.select(".pickScenario.step").node().scrollIntoView()
            })

            d3.select("#rightNav")
                .style("pointer-events", "visible")
            d3.select("#leftNav")
                .style("pointer-events", "none")
            d3.select("#rightNav div")
                .transition()
                .duration(1400)
                .style("opacity",.75)
            d3.select("#rightNav img")
                .transition()
                .duration(1400)
                .style("opacity",1)
            d3.select("#leftNav div")
                .transition()
                .duration(1400)
                .style("opacity",0)
            d3.select("#leftNav img")
                .transition()
                .duration(1400)
                .style("opacity",0)

    }else{
        d3.select("#overlayImage")
            .style("background-image", "url('images/scenarios/" + scenario + ".jpg')")
            .style("display","block")
            .transition()
            .duration(1400)
            .style("opacity",1)
            .on("end", function(){
                d3.select(".pickScenario.step").node().scrollIntoView()
            })
        d3.selectAll(".overlayEl")
            .transition()
            .duration(1400)
            .style("opacity",1)
        if(+cardNum == 1){
            d3.select("#rightNav")
                .style("pointer-events", "visible")
            d3.select("#leftNav")
                .style("pointer-events", "none")
            d3.select("#rightNav div")
                .transition()
                .duration(1400)
                .style("opacity",.75)
            d3.select("#rightNav img")
                .transition()
                .duration(1400)
                .style("opacity",1)
            d3.select("#leftNav div")
                .transition()
                .duration(1400)
                .style("opacity",0)
            d3.select("#leftNav img")
                .transition()
                .duration(1400)
                .style("opacity",0)
        }
        else if(+cardNum == 6){
            d3.select("#leftNav")
                .style("pointer-events", "visible")
            d3.select("#rightNav")
                .style("pointer-events", "none")
            d3.select("#leftNav div")
                .transition()
                .duration(1400)
                .style("opacity",.75)
            d3.select("#leftNav img")
                .transition()
                .duration(1400)
                .style("opacity",1)
            d3.select("#rightNav div")
                .transition()
                .duration(1400)
                .style("opacity",0)
            d3.select("#rightNav img")
                .transition()
                .duration(1400)
                .style("opacity",0)
        }
        else{
            d3.select("#rightNav")
                .style("pointer-events", "visible")
            d3.select("#leftNav")
                .style("pointer-events", "visible")
            d3.selectAll(".overlayNavArrow div")
                .transition()
                .duration(1400)
                .style("opacity",.45)
            d3.selectAll(".overlayNavArrow img")
                .transition()
                .duration(1400)
                .style("opacity",1)
        }
    }

    var leftMargin = (-1*(cardNum - 1) * 100) + "vw"
    d3.selectAll(".overlayContainer:not(." + scenario +")")
        .classed("active",false)
        .transition()
        .duration(1400)
        .style("opacity",0)
        .on("end", function(){
            d3.select(this).style("display","none")
        })



    d3.select(".overlayContainer." + scenario)
        .classed("active",true)
        .style("display","block")
        .transition()
        .duration(function(){ return (trigger == "menu") ? 0 : 500})
        .style("opacity", 1)
        .style("margin-left",leftMargin)

    if(cardNum == 5){
        d3.select("#fixedChartContainer")
        .transition()
        .duration(1400)
        .style("left", (IS_PHONE()) ? "50px" : "90px")
    }
    else if(cardNum == 6){
        d3.select("#fixedChartContainer")
        .transition()
        .duration(1400)
        .style("left", "1000vw")
    }else{
         d3.select("#fixedChartContainer")
        .transition()
        .duration(function(){ return (trigger == "menu") ? 0 : 500})
        .style("left", "-1000vw")       
    }


    d3.select("#overlayNavBar")
        .classed("inverted", function(){
            return (cardNum == 1)
        })
    d3.selectAll(".overlayEl")
        .classed("inverted", function(){
            return (cardNum == 1)
        })
    d3.select("#closeOverlay")
        .classed("inverted", function(){
            return (cardNum == 1)
        })
    d3.selectAll(".overlayNavContainer")
        .classed("active",false)

    d3.select(".overlayNavContainer.card" + cardNum)
        .classed("active",true)
}

$(document).ready(function(){
    $('html').animate({scrollTop:0}, 1);
    $('body').animate({scrollTop:0}, 1);

});


