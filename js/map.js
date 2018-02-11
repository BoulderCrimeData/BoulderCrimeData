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

	map.addSource({
	 type: 'geojson',
	  data: 'data/CrimeLocations.json'
	});


	/*
	var crimeData;
	$.support.cors = true;
	$.getJSON('data/CrimeLocations.json', function (data) {
		crimeData = data;
		for (crime = 0; crime < crimeData.features.length; crime++){
			var crimePoint = crimeData.features[crime].geometry.coordinates;
		}
	});
	var myLayer = L.mapbox.featureLayer().setGeoJSON(crimeData).addTo(map);*/

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