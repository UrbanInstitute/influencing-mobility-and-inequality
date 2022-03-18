function getSize(){
  // return "desktop"
  if(IS_MOBILE()) return "mobile"
  else if(IS_PHONE()) return "phone"
  else return "desktop"
}
function getIntroChartWidth(section){
  var w;
  if(IS_MOBILE()) w = window.innerWidth - 80
  else w = window.innerWidth - 520
  var margins = getIntroChartMargins(section),
    width = w - margins.left - margins.right;
  return width
}
function getIntroChartHeight(section, index){
  var baseH = window.innerHeight,
    margins = getIntroChartMargins(section),
  
    height = baseH - margins.top - margins.bottom;
  return height
}
function getIntroChartMargins(section){
  var size = getSize()
  var mb = (section == "explore") ? 60 : 33;
  var margin;
  if(getSize() == "desktop") margin = {top: 20, right: (window.innerWidth - 1000)*.5, bottom: mb, left: 40}
  else margin = {top: 70, right: 100, bottom: mb, left: 40}

  return margin;  
}



function getExploreChartWidth(section){
  var w = 900,
      margins = getExploreChartMargins(section),
    width = w - margins.left - margins.right;
  return width
}
function getExploreChartHeight(section, index){
  var baseH = window.innerHeight,
    margins = getExploreChartMargins(section),
  
    height = baseH - margins.top - margins.bottom;
  return height
}
function getExploreChartMargins(section){
  var size = getSize()
  var mb = (section == "explore") ? 60 : 33;
  var margin = {top: 20, right: 20, bottom: mb, left: 40}

  return margin;  
}



function getIntroX(){
  var w = getIntroChartWidth(),
      margins = getIntroChartMargins()

  var x = d3.scaleLinear()
    .range([margins.left, w-margins.right])
    .domain([0,4])

  return x

}
function getIntroY(){
  var h = getIntroChartHeight(),
      margins = getIntroChartMargins()

  var y = d3.scaleLinear()
    .range([margins.top, h])
    .domain([100,-100])

  return y

}

function getActiveScenario(){
  if(d3.select(".overlayContainer.active").node() == null) return false
  else return d3.select(".overlayContainer.active").attr("data-scenario")
}
function getActiveCardNum(){
  if(d3.select(".overlayNavContainer.active").node() == null) return 1
  else return d3.select(".overlayNavContainer.active").attr("data-card")
}


function getExploreData(){
  return d3.select("#exploreDataContainer").datum()
}
function getIntroData(){
  return d3.select("#introDataContainer").datum()
}

