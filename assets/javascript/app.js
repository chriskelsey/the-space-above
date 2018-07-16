
//API Urls
queryStarUrl = 'https://www.astropical.space/astrodb/api.php?';
queryPlanetUrl = 'https://www.astropical.space/astrodb/api-ephem.php?';

var skyObj = [];
var starObj = [];
var planetObj = [];


//Function to calculate Right Ascension based on Longitude
function calcRa(long){
	return (long+360)/15;
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

		getPlanets(lat,long);

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

		skyObj = Object.assign(starObj,planetObj);

		for (var el in skyObj) {

			var a = $("<button>");
			a.addClass ("test");
			a.attr("data-name", skyObj[el].name);
			a.text(skyObj[el].name);
			$(".placeholder").append(a);
		}
		getStarTable(skyObj);
	});
}

function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert('Geolocation is not supported by this browser');
	}
	console.log('getLocation complete');
}

function showPosition(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	getStars(latitude,longitude);
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
			
			getStars(lat,long);

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
		var queryURLImage = "https://en.wikipedia.org/w/api.php?action=query&titles=" + subject + "&prop=pageimages&format=json&pithumbsize=300"

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
		var queryURLBlurb = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&format=json&exintro=&titles=" + subject;
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
			
function getStarTable(obj) {
	var htm = '<table class="table table-hover col-md-12" id="techTable">';
  	htm+= '<tr><th>Name</th><th>Constellation [Abbr.]</th><th>Distance [AU]</th><th>Right Ascension</th><th>Declination</th><th>Magnitude</th><th>Mass [<sup>*7</sup>]</th>';
  	htm+= "<th>Radial Velocity</th><th>Radius [<sup>*7</sup>]</th><th>Spectral Type</th><th>Temperature [K]</th></tr>";
  	obj.forEach(function(arr) {
  		console.log(arr.value);
  		if(arr.value == 'undefined'){console.log(arr.value)};
    	htm+= "<tr><td>"+arr['name']+"</td><td>"+arr['con']+"</td><td>"+(arr['dist']) + "</td><td>";
    	htm+= arr['ra']+"</td><td>"+arr['de']+"</td><td>"+arr['mag']+"</td><td>"+arr['mass']+"</td>";
    	htm+= "<td>"+arr['rad']+"</td><td>"+arr['radius']+"</td><td>"+arr['spk']+"</td><td>"+arr['teff']+"</td></tr>";
	});
    htm+= "</table>";
    $('#dynamicTable').html(htm);
}


//content change --- this seems to be a duplicate of below code
// $(document).on("click", "#go", function() {
// 	var location = $("#locationInput").val().trim();

// 	console.log(location);

// 	$("#header").empty();
// 	$("#content").animate({
// 		top: "-=375px",
// 	}, duration = 500);
	
// })

$(document).ready(function() {
	$('.test').on('click', function (e) {
		$('#flyOut').offset({top: e.pageY + 50, left: e.pageX}).fadeIn();
	});
});




var theJumbo = $("#theJumbo");
var d3Container = $("#d3Stuff");
var flyOut = $("#flyOut");
var body1 = $("#body1");
var body2 = $("#body2");
theJumbo.hide();
d3Container.hide();
flyOut.hide();
body2.hide();

//content change
$(document).on("click", "#go", function() {
	var location = $("#locationInput").val().trim();
	$("#header").empty();
	$("#content").animate({
		top: "-=375px",
	}, duration = 500);

	document.body.style.background = "";

  $(".mainBody").css({"height": "0", "padding" : "30px"});
	
	$("body").css({"background": "black"});
	//$("#container1").empty();
	
	d3Container.fadeIn("slow");
	theJumbo.fadeIn("slow");
	GoogleGeocoding();
	
});
