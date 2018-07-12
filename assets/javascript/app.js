//API Urls
queryStarUrl = 'http://www.astropical.space/astrodb/api.php?';
queryPlanetUrl = 'http://www.astropical.space/astrodb/api-ephem.php?';

queryStarUrl += $.param({
	'table':'stars',
	'format':'json'
});

astroResp = [];

starObj = {};

function calcRa(long){
	return (long+360)/15
}

function getSkies(lat,long){
	$.ajax({
		url:queryStarUrl,
		method: 'GET'
	}).then(function(response){
		var jsonVar = $.parseJSON(response);
		var stars = jsonVar.hipstars;
		var ra = calcRa(long);
		//establish positive or negative values
		var posLat = lat >= 0 ? 1 : -1;
		for (var i = 0; i < stars.length; i++) {
			if((stars[i].de >lat-30 && stars[i].de < lat+30) && (stars[i].ra < ra + 20 && stars[i].ra > ra - 20)){
				starObj.bvc = stars[i].bvc;
				starObj.con = stars[i].con;
				starObj.dist = stars[i].dist;
				starObj.hip = stars[i].hip;
				starObj.id = i;
				starObj.mag = stars[i].mag;
				starObj.mass = stars[i].mass;
				starObj.name = stars[i].name;
				starObj.ra = stars[i].ra;
				starObj.rad = stars[i].rad;
				starObj.radius = stars[i].radius;
				starObj.spk = stars[i].spk;
				starObj.teff = stars[i].teff;
				astroResp.push(starObj);
			}
		}
		console.log(astroResp);
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
