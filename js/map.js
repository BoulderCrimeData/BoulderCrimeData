var map;
$(document).ready(function () {
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Ymhhc3dhbXkiLCJhIjoiY2pkaHRqbXpxMTJtODMybnF1dm42N25iYSJ9.s554YMgC8jRC9q3Y7iwubw';
	map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/mapbox/dark-v9',
	    center: [-105.2705, 40.0150], // boulder coordinates
	    zoom: 11.5,
	    attributionControl: false
    });
    
    map.on("style.load", function (){
        $.getJSON('data/CrimeLocations.json', function (data) {
            var crimes = []
            for (var i = 0; i < data.features.length; i++){
                var crime = data.features[i]
                crimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": "crime", "icon": "point"}})
            }

            console.log(crimes);
                
            map.addSource('earthquakes', {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": crimes
                }
            });

            map.addLayer({
                "id": "earthquakes-heat",
                "type": "heatmap",
                "source": "earthquakes",
                "maxzoom": 24,
                "paint": {
                    // increase weight as diameter breast height increases
                    'heatmap-weight': {
                      property: 'dbh',
                      type: 'exponential',
                      stops: [
                        [1, 0],
                        [62, 1]
                      ]
                    },
                    // increase intensity as zoom level increases
                    'heatmap-intensity': {
                      stops: [
                        [11, 1],
                        [15, 1]
                      ]
                    },
                    // assign color values be applied to points depending on their density
                    'heatmap-color': [
                      'interpolate',
                      ['linear'],
                      ['heatmap-density'],
                      0, 'rgba(248, 233, 77, 0)',
                      0.1, 'rgba(248, 233, 77, 0.2)',
                      0.2, 'rgba(248, 233, 77, 0.4)',
                      0.3, 'rgba(248, 233, 77, 0.6)',
                      0.9, 'rgba(248, 233, 77, 1)'
                    ],
                    // increase radius as zoom increases
                    'heatmap-radius': {
                      stops: [
                        [11, 15],
                        [15, 20]
                      ]
                    },
                    // decrease opacity to transition into the circle layer
                    'heatmap-opacity': {
                      default: 1,
                      stops: [
                        [14, 1],
                        [15, 0]
                      ]
                    },
                  }
            }, 'waterway-label');

        });
    });

});

