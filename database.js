var mongoose = require( 'mongoose' );
var mongooseLong = require('mongoose-long')(mongoose);
var Schema   = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

// KEP Schema
var keps = new mongoose.Schema({
  aa					: Number,
	kepCode			: Number,
	kepTitle		: String,
	area				: String,
	county			: String,
	region			: String,
	address			: String,
	tk					: Number,
	phoneNumber	: SchemaTypes.Long,
	fax					: Number,
	email 			: String,
	comments 		: String,
	lat 				: Number,
	lon 				: Number
});

var kepDocs = mongoose.model('keps', keps);

//Connect to local database
mongoose.connect('localhost', 'findnearestkeps');

/*
	Command to import database from CSV

	mongoimport --db dbName --collection collectionName --type csv --headerline --file filePath

	@dbName --> findnearestkeps
	@collectionName --> keps
	@filePath (Depents on user preferences)
*/

/*
	Command to export database to CSV

	mongoexport --db dbName --collection collectionName --csv --fields aa,kepCode,kepTitle,area,county,region,address,tk,phoneNumber,fax,email,comments,lat,lon --out filePath

	@dbName --> findnearestkeps
	@collectionName --> keps
	@filePath (Depents on user preferences)
*/