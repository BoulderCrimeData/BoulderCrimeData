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


	//console.log("test");

	var crimeData;
	$.support.cors = true;
	$.getJSON('data/CrimeLocations.json', function (data) {
		crimeData = data;
		
			

		


		map.on('load', function() {
		    map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
		        if (error) throw error;
		        var arr = [];
		        
		        map.addImage("cat", image);

		        for (crime = 0; crime < crimeData.features.length; crime++){
		        	var crimePoint = crimeData.features[crime].geometry.coordinates;
		        map.addLayer({

		            "id": "cat",
		            "type": "symbol",
		            "source": {
		                "type": "geojson",
		                "data": {
		                    "type": "FeatureCollection",
		                    "features": [{
		                        "type": "Feature",
		                        "geometry": {
		                            "type": "Point",
		                            "coordinates": [crimePoint[0], crimePoint[1]]
		                        }
		                    }]
		                }
		            },
		            "layout": {
		                "icon-image": "cat",
		                "icon-size": 0.25
		            }
		        });
		    }
		    });
			});
		
	});

	//var myLayer = L.mapbox.featureLayer().setGeoJSON(crimeData).addTo(map);

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

