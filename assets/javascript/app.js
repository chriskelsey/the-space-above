queryUrl = 'http://www.astropical.space/astrodb/api.php?';

queryUrl += $.param({
	'table':'stars',
	'format':'json'
});

$.ajax({
	url:queryUrl,
	method: 'GET'
}).then(function(response){
	var jsonVar = $.parseJSON(response);
	var stars = jsonVar.hipstars
	for (var i = 0; i < stars.length; i++) {
		//for now 37 is latitude
		if(stars[i].de >37-30 && stars[i].de < 37+30){
			document.write(stars[i]);
		}
	}
});

function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition)
	} else {
		alert('Geolocation is not supported by this browser');
	}
}

function showPosition(position){
	var latitude = position.coords.latitude;
	var longitute = position.coords.longitude;

	//Do something with lat and long here.
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
