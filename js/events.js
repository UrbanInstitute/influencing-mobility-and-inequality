var dispatch = d3.dispatch("changeDistrict","changeLevel","changeSchool","changeSchoolTypes","active","resized","reset", "dataLoad");


function bindGlobalData(milwaukeeData, schoolData, mapData, allDistrictData){
    d3.select("#schoolDataContainer").datum(schoolData)
    d3.select("#allDistrictDataContainer").datum(allDistrictData)
}

$(document).ready(function(){
    $('html').animate({scrollTop:0}, 1);
    $('body').animate({scrollTop:0}, 1);
});

