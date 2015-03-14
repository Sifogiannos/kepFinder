$(function () {
	var pac_input = document.getElementById('position-input');
	var autocomplete;
	//initialize geolocation button
	if ("geolocation" in navigator) {
	  /* geolocation is available */
	  $('.geolocation-switch').html('<p>use geolocation</p><div class="switch"><input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="cmn-toggle-1"></label></div>');
	  $("#cmn-toggle-1").prop('checked',false);
	  autocomplete = new google.maps.places.Autocomplete(pac_input);
	} else {
	  /* geolocation IS NOT available */
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
		var geolocation = $("#cmn-toggle-1").prop('checked');
		if(geolocation){
			navigator.geolocation.getCurrentPosition(function(position) {
			  alert(position.coords.latitude+" "+position.coords.longitude);
			});
		}
		else{
			var place = autocomplete.getPlace();
			alert(place.geometry.location);
		}
	});

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


});




