
$(function () {

	//Init values
	var pac_input = document.getElementById('position-input');
	var autocomplete;
	var myLocation ={
		lat:0,
		lon:0
	}


	var tkmCircle;
	var fkmCircle;
	var tkmMarkers = [];
	var fkmMarkers = [];
	var map;
	//Default option checked
	$("#tkm").prop('checked',true);
	$("#fkm").prop('checked',false);
	//Circle options
	var tkmCircleOptions = {
		strokeColor: '#00FF00',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#00FF00',
		fillOpacity: 0.15,
		radius: 2000
	};
	var fkmCircleOptions = {
		strokeColor: '#FFFF00',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FFFF00',
		fillOpacity: 0.15,
		radius: 5000
	};
	var kepsLessThan2km;
	var kepsLessThan5km;
	autocomplete = new google.maps.places.Autocomplete(pac_input);

	checkGeolocation();

	function getMarkers(lat,lon){
		myLocation.lat = lat;
		myLocation.lon = lon;

		$.ajax({
			url: '/find/keps',
			data: {lat: lat,lon:lon},
		})
		.done(function(response) {
			showSecondPage(response);
		});
	}
	(function pacSelectFirst(input){
	    // store the original event binding function
	    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

	    function addEventListenerWrapper(type, listener) {
	    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
	    // and then trigger the original listener.

	    if (type == "keydown") {
	      var orig_listener = listener;
	      listener = function (event) {
	        var suggestion_selected = $(".pac-item-selected").length > 0;
	        if (event.which == 13 && !suggestion_selected) {
	          var simulated_downarrow = $.Event("keydown", {keyCode:40, which:40})
	          orig_listener.apply(input, [simulated_downarrow]);
	        }

	        orig_listener.apply(input, [event]);
	      };
	    }

	    // add the modified listener
	    _addEventListener.apply(input, [type, listener]);
	  }

	  if (input.addEventListener)
	    input.addEventListener = addEventListenerWrapper;
	  else if (input.attachEvent)
	    input.attachEvent = addEventListenerWrapper;

	})(pac_input);

	function showSecondPage(data){
		$("#page-1").css('display', 'none');
		$("#page-2").css('display', 'block');
		$("header").html('<h3><a href="/"><i class="fa fa-angle-left"></i> Back</a></h3>');
		kepsLessThan2km = data.kepsLessThan2km;
		kepsLessThan5km = data.kepsLessThan5km;
		var myLatlng = new google.maps.LatLng(myLocation.lat,myLocation.lon);
			var mapOptions = {
				zoom: 15,
				center: myLatlng
			}
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var marker = new google.maps.Marker({
    		position: myLatlng,
    		map: map,
    		title: "You are here",
    		icon: '/img/blue_marker.png'
    	});
		tkmCircleOptions.map = map;
		fkmCircleOptions.map = map;
		tkmCircleOptions.center = myLatlng;
		fkmCircleOptions.center = myLatlng;
		if(kepsLessThan2km){
		    showMarkers(kepsLessThan2km,'tkm');
		}
		else if(kepsLessThan5km){
			$('#fkm').prop('checked',true);
		}
		else{
			showMarkers();
		}
	}
	function checkGeolocation(){
		//initialize geolocation button
		if ("geolocation" in navigator) {
			/* geolocation is available */
			$('.geolocation-switch').html('<p>Χρήση geolocation</p><div class="switch"><input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="cmn-toggle-1"></label></div>');
			$("#cmn-toggle-1").prop('checked',false);
		} else {
			/* geolocation IS NOT available */
		}
	}
	function showMarkers(locationsArray,markerArray){
		createCircle(markerArray)
	    locationsArray.forEach(function(val,index){
	    	var nearestKep = new google.maps.LatLng(val.lat,val.lon);
	    	var marker = new google.maps.Marker({
	    		position: nearestKep,
	    		map: map,
	    		title: val.kepTitle
	    	});
	    	if(markerArray=='tkm'){
	    		tkmMarkers.push(marker);
	    	}
	    	else{
	    		fkmMarkers.push(marker);
	    	}
	    });
	}
	$(document).on('change', '#cmn-toggle-1', function(event) {
		event.preventDefault();
		/* Act on the event */
		var geolocation = $(this).prop('checked');
		if(geolocation){
			$(".input").html('');
		}
		else{
			$(".input").html('<input type="text" name="position" id="position-input" placeholder="Where are you now?" value="">');
			pac_input = document.getElementById('position-input');
			autocomplete = new google.maps.places.Autocomplete(pac_input);
		}
	});

	$(document).on('submit', '#position', function(event) {
		event.preventDefault();
		/* Act on the event */
		var lat,lon;
		var geolocation = $("#cmn-toggle-1").prop('checked');
		if(geolocation){
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				getMarkers(lat,lon);
			});
		}
		else{
			var place = autocomplete.getPlace();
			lat = place.geometry.location.lat();
			lon = place.geometry.location.lng();
			getMarkers(lat,lon);

		}
	});
	$(document).on('change','#tkm', function () {
		$(this).prop('checked') ? showMarkers(kepsLessThan2km,'tkm'): deleteMarkers('tkm');
	});
	$(document).on('change','#fkm', function () {
		$(this).prop('checked') ? showMarkers(kepsLessThan5km,'fkm'): deleteMarkers('fkm');
	});

	// Sets the map on all markers in the array.
	function setAllMap(map,markersArray) {
		if(markersArray=='tkm'){
			for (var i = 0; i < tkmMarkers.length; i++) {
				tkmMarkers[i].setMap(map);
			}
			tkmCircle.setMap(null);
		}
		else{
			for (var i = 0; i < fkmMarkers.length; i++) {
				fkmMarkers[i].setMap(map);
			}
			fkmCircle.setMap(null);
		}

	}
	// Removes the markers from the map, but keeps them in the array.
	function clearMarkers(markersArray) {
	  setAllMap(null,markersArray);
	}

	// Deletes all markers in the array by removing references to them.
	function deleteMarkers(markersArray) {
		var tkm = $("#tkm").prop('checked');
		var fkm = $("#fkm").prop('checked');
		clearMarkers(markersArray);
		if(tkm){
			showMarkers(kepsLessThan2km,tkmMarkers);
		}
		else if(fkm){
			showMarkers(kepsLessThan5km,fkmMarkers);
		}
	}
	function createCircle(markerArray){
		console.log(tkmCircle);
		if(markerArray=="tkm" && !tkmCircle){
			tkmCircle = new google.maps.Circle(tkmCircleOptions);
		}
		else if(markerArray=="tkm" && tkmCircle){
			tkmCircle.setMap(map);
		}
		else if(markerArray=="fkm" && !fkmCircle){
			fkmCircle = new google.maps.Circle(fkmCircleOptions);
		}
		else if(markerArray=="fkm" && fkmCircle){
			fkmCircle.setMap(map);
		}
	}
});




