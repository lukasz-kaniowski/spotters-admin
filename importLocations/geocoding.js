var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var geocoderProvider = 'google';
var httpAdapter = 'http';

var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);


var output = [];
var parser = parse({delimiter: ','})
var input = fs.createReadStream('importLocations/lista.csv');

var successCount = 0;

var geocoding = transform(function(record, callback){
	var adres = record[3] + ', '+ record[4] +', Polska';

	geocoder.geocode(adres, function(err, res) {
    	
    	if(res.length == 1){
    		successCount ++;
			callback(null, JSON.stringify(res) +'\n');
    	}else{
    		callback(null, res.length + ' results for: '+adres +'\n');
    	}
    	
	});
    
}, {parallel: 10});





input
.pipe(parser)
.pipe(geocoding)
.pipe(process.stdout)
.pipe(transform(function(record, cb){
	console.log('Successful for '+ successCount)
	cb()
}));