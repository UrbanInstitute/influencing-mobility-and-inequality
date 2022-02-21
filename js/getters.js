function getSize(){
  // return "desktop"
  if(IS_MOBILE()) return "mobile"
  else if(IS_PHONE()) return "phone"
  else return "desktop"
}
function getIntroChartWidth(section){
  var w = 500,
      margins = getIntroChartMargins(section),
    width = w - margins.left - margins.right;
  return width
}
function getIntroChartHeight(section, index){
  var baseH = 500,
    margins = getIntroChartMargins(section),
  
    height = baseH - margins.top - margins.bottom;
  return height
}
function getIntroChartMargins(section){
  var size = getSize()
  var mb = (section == "explore") ? 60 : 33;
  var margin = {top: 20, right: 20, bottom: mb, left: 40}

  return margin;  
}
function getExploreChartWidth(section){
  var w = 900,
      margins = getExploreChartMargins(section),
    width = w - margins.left - margins.right;
  return width
}
function getExploreChartHeight(section, index){
  var baseH = 900,
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
    .range([margins.left, w])
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

function getExploreData(){
  return d3.select("#exploreDataContainer").datum()
}
function getIntroData(){
  return d3.select("#introDataContainer").datum()
}

