//API Urls
queryStarUrl = 'http://www.astropical.space/astrodb/api.php?';
queryPlanetUrl = 'http://www.astropical.space/astrodb/api-ephem.php?';

var skyObj = [];
var starObj = [];
var planetObj = [];


//Function to calculate Right Ascension based on Longitude
function calcRa(long){
	return (long+360)/15
}

//Join star and planet arrays
function getSkies(lat,long) {
	getStars(lat,long);
	getPlanets(lat,long);

	for (var i = 0; i < planetObj.length; i++) {
		starObj.push(planetObj[i]);
	}
	console.log(starObj);
}

function getStars(lat,long){
	//Pass Star Parameters
	queryStarUrl += $.param({
		'table':'stars',
		'format':'json'
	});
	$.ajax({
		url:queryStarUrl,
		method: 'GET'
	}).then(function(response){
		var jsonVar = $.parseJSON(response);
		var stars = jsonVar.hipstars;
		var ra = calcRa(long);

		for (var i = 0; i < stars.length; i++) {
			if((stars[i].de >lat-30 && stars[i].de < lat+30) && (stars[i].ra < ra + 20 && stars[i].ra > ra - 20)){
				starObj.push({
					bvc : stars[i].bvc,
					con : stars[i].con,
					dist : stars[i].dist,
					de : stars[i].de,
					hip : stars[i].hip,
					id : i,
					mag : stars[i].mag,
					mass : stars[i].mass,
					name : stars[i].name,
					ra : stars[i].ra,
					rad : stars[i].rad,
					radius : stars[i].radius,
					spk : stars[i].spk,
					teff : stars[i].teff
				});
			}
		}
	});
}

function getPlanets(lat,long){
	//Pass Planet Parameters
	queryPlanetUrl += $.param({
		'lat':lat,
		'long':long
	});

	$.ajax({
		url:queryPlanetUrl,
		method: 'GET'
	}).then(function(response){
		var jsonVar = $.parseJSON(response);
		var planets = jsonVar.response;
		var ra = calcRa(long);

		for (var i = 0; i < planets.length; i++) {
			if((planets[i].de >lat-30 && planets[i].de < lat+30) && (planets[i].ra < ra + 20 && planets[i].ra > ra - 20)){
				planetObj.push({
					bvc : planets[i].bvc,
					con : planets[i].const,
					dist : planets[i].au_sun,
					de : planets[i].de,
					hip : planets[i].hip,
					id : i,
					mag : planets[i].mag,
					mass : planets[i].mass,
					name : planets[i].name,
					ra : planets[i].ra,
					rad : planets[i].rad,
					radius : planets[i].radius,
					spk : planets[i].spk,
					teff : planets[i].teff
				});
			}
		}
	});
}

function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
		console.log('Here');
	} else {
		alert('Geolocation is not supported by this browser');
	}
}

function showPosition(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	getSkies(latitude,longitude);

}


function GoogleGeocoding() {
	var address = $('#locationInput').val().trim();
	var apiKey = 'AIzaSyCeliRmHt2owSqzkOW55Jhoifz3B-YCuUU';
	var queryUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + 'key=' + apiKey;

	$.ajax({
		url: queryUrl,
		method:'GET'
	}).then(function(response){

		var status = response.status;
		if(status === 'OK'){
			var location = response.results[0].geometry.location;
			var lat = location.lat;
			var long = location.lng;
			
			// Do Something With Lat & Long here.
		} else {
			// Errors to be returned to client side if query doesn't return results.
			console.log(address + ' is not a valid location');
			console.log("Please enter a valid location in '123 Main Street, SomeState, USA' or 'City, SomeState' format.");

			// Do Something With Errors Here
		}		
	});
}
