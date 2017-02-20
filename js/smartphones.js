// putting the map on the screen and centering it with the right zoom level
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 2
});

// adding a layer to make it visually appealing - found by searching tile layers for leaflet
var countryTiles = L.tileLayer.provider('Esri.WorldGrayCanvas');
countryTiles.addTo(map);


//setting the gradient to display countries based on speed - gradient colors pulled from colorbrewer
function getColor(sphone) {
    return sphone > 80  ? '#49006a' :
           sphone > 60  ? '#7a0177' :
           sphone > 40  ? '#f768a1' :
           sphone > 20  ? '#fa9fb5' :
           sphone > 0   ? '#fde0dd' :
                      '#f9f9f9';
}

//function to put the colors into
function style(feature) {
    return {
        fillColor: getColor(feature.properties.sphone),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var geojson;

// function to create hover effect on country
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#1b0227',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

//function to reset hover effext
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}


    

// create a pop up from the properties stored in the geoJSON file
function infoPopUp (e){
    var country = e.target;
    var cName = country.feature.properties.name;
    var cSpeed = country.feature.properties.speed;
    var cUsers = country.feature.properties.users;
    var cSphone = country.feature.properties.sphone; 
    country.bindPopup("<h4>" + cName + "</h4><p>Average Internet Speed</p><b> " + cSpeed + "</b><p>Internet Users (% of population)</p><b> " + cUsers + "</b><p>Smartphone Users (% of population)</p><b> " + cSphone + "</b>").openPopup();
}

// call the above listener functions
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature, 
        mouseout: resetHighlight,
        click: infoPopUp
             });
}


//adding the geoJSON data to the map and applying the style above
//geojson = L.geoJson(countryData, {style: style}).addTo(map);
geojson = L.geoJson(countryData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//adding a legend
var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 20, 40, 60, 80],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

legend.addTo(map);

