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

//Wikipedia Integration

var subject;

var wikiData = [];
var wiki = {
	"blurb": "",
	"image": "",
}

function getWiki () {

	function getImage() {
		var queryURLImage = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subject + "&prop=pageimages&format=json&pithumbsize=200"

		$.ajax({
			url: "https://safe-headland-27088.herokuapp.com/" + queryURLImage,
			method: "GET",
			"crossDomain": true,
			"async": true
		}).then(function(response) {
			$.each(response.query.pages,
			function(index, value) {
				wiki.image = value.thumbnail.source;
				console.log(wiki.image);
				$(".card-img-top").attr("src", wiki.image);
			});
		})

	}

	function getBlurb () {
		var queryURLBlurb = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&format=json&exintro=&titles=" + subject;

		$.ajax({
			url: "https://safe-headland-27088.herokuapp.com/" + queryURLBlurb,
			method: "GET",
			"crossDomain": true,
			"async": true
		}).then(function(response) {
			$.each(response.query.pages,
			function(index, value) {
				wiki.blurb = value.extract;
				console.log(wiki.blurb);
				$(".card-title").empty()
				$(".card-title").append(subject);
				$(".searchmatch").empty();
				$(".searchmatch").append(wiki.blurb);
			});
		});
	};

	getImage();
	getBlurb();

};

function getStarData(arr) {
	getWiki();
	wikiData.push(wiki);
};

$(document).on("click", ".test", function () {
	subject = $(this).attr("data-name");
	getStarData();
});

//content change
$(document).on("click", "#go", function() {
	var location = $("#locationInput").val().trim();

	console.log(location);

	$("#header").empty();
	$("#content").animate({
		top: "-=375px",
	}, duration = 500);
	
})




