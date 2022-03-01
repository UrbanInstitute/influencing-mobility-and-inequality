const NARRATIVE_FIXED_R = 7,
      NARRATIVE_DOT_SCALAR = .4,
      MAP_DOT_SCALAR = .4,
      TAMARACK_ID = "A9703704",
      // TAMARACK_ID = "360096606069",
      MILWAUKEE_ID = "5509600",
      // MILWAUKEE_ID = "3620580"
      DEFAULT_MAP_CENTER = [-87.95301604229502,43.05051815873145],
      // DEFAULT_MAP_CENTER = [-73.700009,-74.25909,40/.477399]
      DEFAULT_MAP_ZOOM = 9.424957516747982,
      DEFAULT_LEVEL = "2",
      MAP_SHOW_DOT_OPACITY = "100%",
      MAP_HIDE_DOT_OPACITY = "10%",
      MAP_SHOW_DOT_OPACITY_STROKE = 1,
      MAP_HIDE_DOT_OPACITY_STROKE = .1,
      V_HIDE_DOT_OPACITY = .1;
      V_SHOW_DOT_OPACITY = .8,
      DEFAULT_TRANSITION_TIME = 250

let ALL_SCHOOL_TYPES = ["tps","private","charter","magnet"],
    ALL_LEVELS = [null,"Elementary school","Middle school","High school"],
    ALL_SCHOOL_TYPES_FULL = {"tps": "traditional public", "private": "private", "charter": "charter", "magnet": "magnet"}

var IS_SHORT = function(){
  return (d3.select("#isShort").style("display") == "block")
}
var IS_PHONE = function(){
  return (d3.select("#isPhone").style("display") == "block")
}
var IS_MOBILE = function(){
  return (d3.select("#isMobile").style("display") == "block") && (d3.select("#isPhone").style("display") == "none")
}
var SECTION_INDEX = function(){
  return d3.select("#sectionIndex").attr("data-index")
}
var IS_IE = false;
function getInternetExplorerVersion(){
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer'){
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
    rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape'){
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
    rv = parseFloat( RegExp.$1 );
  }
  return rv;
}


const INTRO_DUR_TWODOT = 500
const INTRO_DEL_TWODOT = 0
const SWARM_DOT_R = 3;
const SWARM_DOT_DUR = 400
const RESET_DURATION = 200;
const X_BEZIER_CONST = .5
const Y_BEZIER_CONST = -.2
const X_BEZIER_CONST_INTRO = .3
const Y_BEZIER_CONST_INTRO = -.2




var PHONE_VIS_WIDTH = 230;
var PHONE_VIS_HEIGHT = 400;
var SHORT_VIS_WIDTH = 600;
var SHORT_VIS_HEIGHT = 480;
var SHORT_SCATTER_WIDTH = 480;
var PHONE_SCATTER_WIDTH = 235
var VIS_WIDTH = 500;
var VIS_HEIGHT = 480;
var DURATION = 800;
var MARGIN = { top: 10, left: 40, bottom: 120, right: 70 };
var PHONE_MARGIN = MARGIN;
var DOT_MARGIN = {top: 80, bottom: 0}
var PHONE_DOT_MARGIN = {top: 60, bottom: 70}
var ANIMATION_DELAY = true;
var DOLLARS = d3.format("$,.0f")
var RATIOS = d3.format(".2f")
var dotMin = 1;
var dotMax = 1.4;
var thresholdSmall = 6000;
var thresholdLarge = 10000;
var svgWidth,
    svgHeight,
    exploreVWidth,
    exploreVHeight,
    TAMARACK_MEDIAN,
    MILWAUKEE_SUM;


exploreVHeight = 700;
exploreVWidth = 700;

if ( IS_PHONE() ){ svgWidth = PHONE_VIS_WIDTH }
else if ( IS_SHORT() ){ svgWidth = SHORT_VIS_WIDTH }
else{ svgWidth = VIS_WIDTH}

if ( IS_PHONE() ){ svgHeight = PHONE_VIS_HEIGHT }
else if ( IS_SHORT() ){ svgHeight = SHORT_VIS_HEIGHT }
else{ svgHeight = VIS_HEIGHT}

// var introMargin = ( IS_PHONE() ) ? PHONE_MARGIN : MARGIN;
// var exploreMargin = { top: 0, left: 20, bottom: 0, right: 90 };
