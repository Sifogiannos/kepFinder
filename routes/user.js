
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
var keps = mongoose.model('keps');
var geocoder = require('geocoder');
var async = require('async');


exports.findKepsCordinates = function(req, res){
	keps.find({},'region address tk lat lon').lean().exec(function(err, allKEPs){
		var i=0;
			var expData=[];
			//var kepss = [allKEPs[i], allKEPs[i+1], allKEPs[i+2], allKEPs[i+3], allKEPs[i+4]];
			async.eachSeries(allKEPs, function(kep, callback){
				var address = kep.region+", "+kep.address+", "+kep.tk;
				geocoder.geocode(address , function(err, data){
				  if(data!=undefined && data.results[0]!= null && data.results[0]!=undefined){
				  	expData.push({_id: kep._id, location: data.results[0].geometry.location});
					  keps.findOneAndUpdate({_id:kep._id}, {$set:{lat:data.results[0].geometry.location.lat, lon:data.results[0].geometry.location.lng}},function(err){
					  	console.log("iterate is :"+i);
					  	i++;
					  	callback();
					  });
					}else{
						console.log("WARNING: not found :"+i);
						i++;
						callback();
					}
				});
			},function(err){
				res.end("i have ended");
			});
	});
};

exports.testCoordinates = function (req,res){
	keps.findOne({aa:777},'region address tk lat lon').lean().exec(function(err, allKEPs){
		var string = allKEPs.address+" "+allKEPs.tk;
		geocoder.geocode(string,function(err,data){
			res.json(data.results[0].geometry);
		});
	});
}
