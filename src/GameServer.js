/*
 * GameServer.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

var net = require('net');
var modelParser = require('./ModelParser/ModelParser');
var dataInterface = require('./Interface/DataServerInterface');
var poiParser = modelParser.poiParser;

var openDataConnection = function() {
	var dataConnection = net.createConnection('../GameDataServer/connection', function() {
		console.log('Connected to data server!');
	});
	
	dataConnection.on('end', function() {
		console.log('Connection to data server closed!');
	});

	dataConnection.on('error', function(err) {
		console.log('Error in data connection!');
	});
	
	return dataConnection;
}

module.exports = new function() {
	this.connectUser = function() {
		
		
		return 0;
	}
	
	this.disconnectUser = function () {
		return false;
	}
	
	this.getAllPOIs = function(doneCallback) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data) {
			doneCallback(poiParser.parseAllPOIResponse(data));
		});
		dataConnection.on('error', function(){
			doneCallback(false);
		});
		
		var dataRequestBuffer = dataInterface.allPOIsBuffer();
		dataConnection.write(dataRequestBuffer);
	}
	
	this.getPOI = function(request, doneCallback) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data){
			socket.emit('POIResponse', poiParser.parsePOIResponse(data));
		});
		dataConnection.on('error', function() {
			socket.emit('POIResponse', false);
		});
		
		var id = request.id;
		
		var dataRequestBuffer = dataInterface.poiBuffer(id);
		dataConnection.write(dataRequestBuffer);
	}
}
