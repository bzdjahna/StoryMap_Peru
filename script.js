var imageContainerMargin = 70;  // Margin + padding

// This watches for the scrollable container
var scrollPosition = 0;
$('div#contents').scroll(function() {
  scrollPosition = $(this).scrollTop();
});


// Introduction: 
const introduction = `
<h2 style="font-weight:lighter;font-family: 'Roboto Slab', serif;font-size: 120%;"><i class='fa fa-file-text-o'></i> Introduction</h3>
<p class="intro">
In the early 80s and the late 90s, Peruvians experienced an internal armed
conflict between the military and the group known as the Shining Path 
(Communist Party of Peru- Shining Path). The latter started a long war 
to overthrow the government by taking control of the poorest and most forgotten 
areas of the Ayacucho region. In response, the government created the 
Military Political Command in December 1982 and sent armed forces to fight 
this uprising. In this scenario, local Andean communities got caught in the 
crossfire. In consequence, this took a severe toll on the people from Ayacucho 
and throughout other Peruvian regions, with nearly 70,000 casualties and 21,000 
of them still missing (CVR 2003).
This StoryMap draws from the Human Rights Commission (Comisedh) research 
and  uses digital tools to better understand the causes and repercussions 
of this conflict. The current proposal will encourage the use of difficult 
and digital heritage by using testimonies and data gathered in the field 
close to victims’ families, impacting not only new generations but also old
 generations within a hard and long process of reconciliation.
 
 </p>
`

// References: 

const references = ` 
  <div class='reference'>
   <h5><u><i class='fa fa-book'></i> References:</u></h5>
   <ul><li><p class="reference">Matesanz Nogales, A. (2009). Datos para la adaptación castellana de la Escala de Temores (FSS), Análisis y modificación de conducta, 35(152), 67-94.</p></li></ul>
   <ul><li><p class="reference">Pérez de la Dehesa, R. (1969). La editorial Sempere en Hispanoamérica y España. Revista Iberoamericana, XXXV(69), 551-555.</p></li></ul>
   <ul><li><p class="reference" style="margin-bottom: 100px;">Strachota, S. (2020). Generalizaing in teh context of an early algebra intervention. Infancia y aprendizaje, 43(2), 347-394.</p></li></ul>
  </div>
`

function initMap() {

  // This creates the Leaflet map with a generic start point, because code at bottom automatically fits bounds to all markers
  var map = L.map('map', {
    center: [0, 0],
    zoom: 5,
    scrollWheelZoom: false
  });

  // This displays a base layer map (other options available)
  var lightAll = new L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);

  // This customizes link to view source code; add your own GitHub repository
  map.attributionControl
  .setPrefix('Created with <a href="http://leafletjs.com" title="A JS library for interactive maps"><strong>Leaflet</a></strong>');

  // This loads the GeoJSON map data file from a local folder
  $.getJSON('StoryMap.geojson', function(data) {
    var geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        (function(layer, properties) {
          // This creates numerical icons to match the ID numbers
          // OR remove the next 6 lines for default blue Leaflet markers
          var numericMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: feature.properties['id'],
            markerColor: 'black'
          });
          layer.setIcon(numericMarker);

          // This creates the contents of each chapter from the GeoJSON data. Unwanted items can be removed, and new ones can be added
          var chapter = $('<p></p>', {
            text:feature.properties['chapter'],
            class: 'chapter-header'
          });

          
          var image = $('<img>', {
            src: feature.properties['source.link'],
          });

          var source = $('<a>', {
            text: feature.properties['source.credit'],
            href: feature.properties['image'],
            target: "_blank",
            class: 'source'
          });

          var description = $('<p></p>', {
            text: feature.properties['description'],
            class: 'description'
          });

          var container = $('<div></div>', {
            id: 'container' + feature.properties['id'],
            class: 'image-container'
          });

          var imgHolder = $('<div></div', {
            class: 'img-holder'
          });
          imgHolder.append(image);

          // Conditional for add videos in story map -----------------------------------------------
          if(feature.properties['video'] < 1){
            container.append(chapter).append(imgHolder).append(source).append(description);
            $('#contents').append(container);
          }else{
            var video = $('<video width="320" height="200" controls></video>', {
            });
            var sourcevideo = $('<source>', {
              src: feature.properties['video'],
            });
            video.append(sourcevideo);
            container.append(chapter).append(imgHolder).append(source).append(description).append(video);
            $('#contents').append(container);
          }
          
          // Conditional for add introduction in story map --------------------------------------------
          if(feature.properties['id']==1){
            container.append(introduction).append(chapter).append(imgHolder).append(source).append(description).append(video);
            $('#contents').append(container);
          }else{
            container.append(chapter).append(imgHolder).append(source).append(description).append(video);
            $('#contents').append(container);
          }

          var i;
          var areaTop = -100;
          var areaBottom = 0;

          // Calculating total height of blocks above active --------------------------------------------
          for (i = 1; i < feature.properties['id']; i++) {
            areaTop += $('div#container' + i).height() + imageContainerMargin;
          }

          areaBottom = areaTop + $('div#container' + feature.properties['id']).height();

          $('div#contents').scroll(function() {
            if ($(this).scrollTop() >= areaTop && $(this).scrollTop() < areaBottom) {
              $('.image-container').removeClass("inFocus").addClass("outFocus");
              $('div#container' + feature.properties['id']).addClass("inFocus").removeClass("outFocus");

              map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0] ], feature.properties['zoom']);
            }
          });

          // Make markers clickable ----------------------------------------------------------------------
          layer.on('click', function() {
            $("div#contents").animate({scrollTop: areaTop + "px"});
          });

        })(layer, feature.properties);
      }
    });

    $('div#container1').addClass("inFocus");
    $('#contents').append("<div class='space-at-the-bottom'><a href='#space-at-the-top'><i class='fa fa-chevron-circle-up'></i></br><small>Top</small></a></div>");
    $('#contents').append(references);
    map.fitBounds(geojson.getBounds());
    geojson.addTo(map);
  });
}

initMap();
