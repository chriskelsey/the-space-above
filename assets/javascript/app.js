var queryUrl = 'https://api.nasa.gov/';
var apiKey = 'l4d8KRDBug3WIoAtVLbVInWj6DgnAAknmIzwgNEm';

queryUrl += $.param({
		'api_key': apiKey,
	});

console.log(queryUrl);

/*$.ajax({
	url:queryUrl,
	method: 'GET'
});*/






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