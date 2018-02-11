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
            var crimes = [];
            var thefts = ["Auto Theft", "Burglary", "Motorcycle Theft", "Robbery", "Theft From Vehicle", "Theft Of Car Parts"];
            var minor_offenses = ["Incident", "Indecency", "Indecent Exposure", "Recovery", "Trespassing", "Vandalism"];
            var violent_crimes = ["Assault", "Homicide", "Sex Assault"];
            var theftcrimes = [];
            var minorcrimes = [];
            var violentcrimes = [];
            for (var i = 0; i < data.features.length; i++){
                var crime = data.features[i]
                if (thefts.indexOf(crime.properties.OFFENSE) != -1) { // is a theft
                  theftcrimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": crime.properties.OFFENSE, "date": crime.properties.REPORTDATE, "icon": "point"}})
                }
                else if (minor_offenses.indexOf(crime.properties.OFFENSE) != -1) { // is a minor offense
                  minorcrimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": crime.properties.OFFENSE, "date": crime.properties.REPORTDATE, "icon": "point"}})
                }
                else if (violent_crimes.indexOf(crime.properties.OFFENSE) != -1) { // is a violent crime
                  violentcrimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": crime.properties.OFFENSE, "date": crime.properties.REPORTDATE, "icon": "point"}})
                }
                crimes.push({"type": "Feature", "geometry": crime.geometry, "properties": { "title": crime.properties.OFFENSE, "date": crime.properties.REPORTDATE, "icon": "point"}})
            }

            map.addSource('theft', {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": theftcrimes
                }
            });

            map.addSource('minor', {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": minorcrimes
                }
            });

            map.addSource('violent', {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": violentcrimes
                }
            });

            map.addLayer({
                "id": "theftid",
                "type": "heatmap",
                "source": "theft",
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
                      0, "rgba(0,0,255,0)",
                      0.2, "rgba(0,0,255,0.2)",
                      0.4, "rgba(0,0,255,0.4)",
                      0.6, "rgba(0,0,255,0.6)",
                      0.8, "rgba(0,0,255,0.8)",
                      1, "rgba(0,0,255,1)"
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
                "id": "minorid",
                "type": "heatmap",
                "source": "minor",
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
                      0, "rgba(0,255,0,0)",
                      0.2, "rgba(0,255,0,0.2)",
                      0.4, "rgba(0,255,0,0.4)",
                      0.6, "rgba(0,255,0,0.6)",
                      0.8, "rgba(0,255,0,0.8)",
                      1, "rgba(0,255,0,1)"
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
                "id": "violentid",
                "type": "heatmap",
                "source": "violent",
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
                      0, "rgba(255,0,0,0)",
                      0.2, "rgba(255,0,0,0.2)",
                      0.4, "rgba(255,0,0,0.4)",
                      0.6, "rgba(255,0,0,0.6)",
                      0.8, "rgba(255,0,0,0.8)",
                      1, "rgba(255,0,0,1)"
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
              id: 'theftidcircles',
              type: 'circle',
              source: 'theft',
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
            
            map.addLayer({
              id: 'minoridcircles',
              type: 'circle',
              source: 'minor',
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

            map.addLayer({
              id: 'violentidcircles',
              type: 'circle',
              source: 'violent',
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

            map.on('click', 'theftidcircles', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML("Type of Crime: " + e.features[0].properties.title + "<br>Date of Crime: " + e.features[0].properties.date)
                .addTo(map);
            });

            map.on('click', 'minoridcircles', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML("Type of Crime: " + e.features[0].properties.title + "<br>Date of Crime: " + e.features[0].properties.date)
                .addTo(map);
            });

            map.on('click', 'violentidcircles', function(e) {
              new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML("Type of Crime: " + e.features[0].properties.title + "<br>Date of Crime: " + e.features[0].properties.date)
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

