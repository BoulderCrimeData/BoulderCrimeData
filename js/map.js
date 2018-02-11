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
                    // Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "mag"],
                        0, 0,
                        6, 1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 1,
                        24, 3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0, "rgba(33,102,172,0)",
                        0.2, "rgb(103,169,207)",
                        0.4, "rgb(209,229,240)",
                        0.6, "rgb(253,219,199)",
                        0.8, "rgb(239,138,98)",
                        1, "rgb(178,24,43)"
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 2,
                        24, 20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 1,
                        9, 0
                    ],
                }
            }, 'waterway-label');

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