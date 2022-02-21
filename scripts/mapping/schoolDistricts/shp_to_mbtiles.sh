
# Reproject source shapefile (from NCES) to web mercator
# Source: https://nces.ed.gov/programs/edge/Geographic/DistrictBoundaries, 2018 boundaries (2017-18 school year)
ogr2ogr data/mapping/schoolDistricts/shapefile/schoolDistricts.shp -t_srs "EPSG:4326" data/mapping/schoolDistricts/source/EDGE_SCHOOLDISTRICT_TL18_SY1718/schooldistrict_sy1718_tl18.shp

#Convert shapefile to geojson
ogr2ogr -f GeoJSON data/mapping/schoolDistricts/geoJson/schoolDistricts_tmp.geojson data/mapping/schoolDistricts/shapefile/schoolDistricts.shp


python scripts/mapping/schoolDistricts/generateids.py k12-segregation


#Convert geojson to mbtiles, min zoom level 6 (max 14 by default). Replace old mbtiles
tippecanoe -o data/mapping/schoolDistricts/mbtiles/schoolDistricts.mbtiles data/mapping/schoolDistricts/geoJson/schoolDistricts.geojson -Z6 --force
