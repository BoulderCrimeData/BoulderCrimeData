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
                crimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": crime.properties.OFFENSE, "date": crime.properties.REPORTDATE, "icon": "point"}})
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
                      0, "rgba(0,0,0,0)",
                      0.2, "rgb(0,0,255)",
                      0.4, "rgb(50,50,200)",
                      0.6, "rgb(100,100,150)",
                      0.8, "rgb(200,200,100)",
                      1, "rgb(255,255,0)"
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

            map.addLayer({
              id: 'trees-point',
              type: 'circle',
              source: 'earthquakes',
              minzoom: 15,
              paint: {
                // increase the radius of the circle as the zoom level and dbh value increases
                'circle-radius': {
                  property: 'dbh',
                  type: 'exponential',
                  stops: [
                    [{ zoom: 15, value: 1 }, 5],
                    [{ zoom: 15, value: 62 }, 10],
                    [{ zoom: 22, value: 1 }, 20],
                    [{ zoom: 22, value: 62 }, 50],
                  ]
                },
                'circle-color': {
                  property: 'dbh',
                  type: 'exponential',
                  stops: [
                    [0, 'rgba(236,222,239,0)'],
                    [10, 'rgb(236,222,239)'],
                    [20, 'rgb(208,209,230)'],
                    [30, 'rgb(166,189,219)'],
                    [40, 'rgb(103,169,207)'],
                    [50, 'rgb(28,144,153)'],
                    [60, 'rgb(1,108,89)']
                  ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                  stops: [
                    [16, 0],
                    [18, 1]
                  ]
                }
              }
            }, 'waterway-label');
            
            map.on('click', 'trees-point', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML("Type of Crime:" + e.features[0].properties.title + "<br>Date of Crime:" + e.features[0].properties.date)
                .addTo(map);
            });



            // map.addLayer({
            //     "id": "points",
            //     "type": "symbol",
            //     "source": {
            //         "type": "geojson",
            //         "data": 
            //     },
            //     "layout": {
            //         "icon-image": "{icon}-15",
            //         "text-field": "{title}",
            //         "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            //         "text-offset": [0, 0.6],
            //         "text-anchor": "top"
            //     },
            // });
            
        });
    });
	

	/*
	map.on('load', function () {
		map.addLayer({
			"id": "points",
	        "type": "symbol",
	        "source": crimeData,
		    "layout": {
	            "icon-image": "{icon}-15",
	            "text-field": "{title}",
	            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
	            "text-offset": [0, 0.6],
	            "text-anchor": "top"
	       	}
		});
	});*/


});

