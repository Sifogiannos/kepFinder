
/*
 * GET index listing.
 */
var mongoose = require('mongoose');
var keps = mongoose.model('keps');

/*
 * To maximize performance keep the Lon,Lat of each kep in system RAM
 */
var allKEPsLatLon=[];
keps.find({}, function(err, allKeps){
	allKEPsData=allKeps;
});


exports.index = function(req, res){
  res.render('index');
};

exports.findNearestKep = function(req, res){
	//use Coordinates
	var userCoordinates = {
		lon :	parseFloat(req.query.lon),
		lat :	parseFloat(req.query.lat)
	};
	var x= kepFinderAlgorithm(allKEPsData, userCoordinates);
	console.log(x.kepsLessThan5km);
	res.json(x);
};

//Find Nearest KEP algorithm
function kepFinderAlgorithm(kepsData, userCoordinates){
	var kepsLessThan2km = [], kepsLessThan5km = [], kepsLessThan10km = [], nearestKeps = [], dArray=[];;

	kepsData.forEach(function(kep, index){
		if(typeof kep.lat == "number"  && typeof kep.lon == "number"){
			//calculate distance of each KEP from user
			var d = geoDistance(userCoordinates, {lon: kepsData[index].lon, lat:kepsData[index].lat});

			dArray.push({ kep: kepsData[index], d:d});
			// kep in range of 2km
			if(d < 2000){
				kepsLessThan2km.push(kepsData[index]);
			}
			// kep in range of 5km
			if(d < 5000){
				kepsLessThan5km.push(kepsData[index]);
			}
			// kep in range of 10km
			if(d < 10000){
				kepsLessThan10km.push(kepsData[index]);
			}
		}
	});
	//If no kep is not closer from 10km distance
	if(kepsLessThan2km.length==0 && kepsLessThan5km.length==0 && kepsLessThan10km.length==0){
		dArray.sort(function(a,b){ return a.d-b.d; });
		nearestKeps=[dArray[0].kep, dArray[1].kep, dArray[2].kep, dArray[3].kep, dArray[4].kep];
	}
	return object = {
		kepsLessThan2km 	: kepsLessThan2km,
		kepsLessThan5km 	: kepsLessThan5km,
		kepsLessThan10km 	: kepsLessThan10km,
		nearestKeps 			: nearestKeps
	};
}

// compute distance between the two points (in a straight line)
function geoDistance(pointOne, pointTwo){
	var R = 6371000; //meters
	var dLat = toRad(pointTwo.lat-pointOne.lat);
	var dLon = toRad(pointTwo.lon-pointOne.lon);

	var dLat1 = toRad(pointOne.lat);
	var dLat2 = toRad(pointTwo.lat);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(dLat1) * Math.cos(dLat1) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;

	return d; //meters
}

function toRad(deg){
	return deg * Math.PI/180;
}
