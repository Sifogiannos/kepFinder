
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
var keps = mongoose.model('keps');
var geocoder = require('simple-geocoder');
var async = require('async');


exports.findKepsCordinates = function(req, res){
	keps.find({},'region address tk').lean().exec(function(err, allKEPs){
		var index=0;
		async.eachSeries(allKEPs, function(kep, callback){
			console.log(index);
			var address = allKEPs[index].region+", "+allKEPs[index].address+", "+allKEPs[index].tk;
			geocoder.geocode(address , function(err, data){
			  if(data){
				  keps.findOneAndUpdate({_id:allKEPs[index]._id}, {$set:{lat:data.x, lon:data.y}},function(err){
				  	callback();
				  });
				}else{
					callback();
				}
				index++;
			});
		},function(err){
			res.json({status:"ok", message: "It took some time :)"});
		});
	});
};