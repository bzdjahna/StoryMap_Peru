library(tidyverse)
library(geojsonio)
library(sf)
data <- read_csv("csv/StoryMap.csv") %>% 
  st_as_sf(coords = c("lon","lat"), crs = 4326)
geojson_write(
  data,
  file = "StoryMap.geojson"
  )

