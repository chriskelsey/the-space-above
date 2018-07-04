var queryUrl = 'https://api.nasa.gov/?';
var apiKey = 'l4d8KRDBug3WIoAtVLbVInWj6DgnAAknmIzwgNEm';

queryUrl += $.param({
		'api_key': apiKey,
	});

$.ajax({
	url:queryUrl,
	method: 'GET'
}).then(function(response){
	console.log(response);
});