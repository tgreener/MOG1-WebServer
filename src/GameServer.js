/*
 * GameServer.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

var net = require('net');
var poiParser = require('./ModelParser/POIParser');

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
	
	this.getAllPOIs = function(doneCallback) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data) {
			doneCallback(poiParser.parseAllPOIResponse(data));
		});
		dataConnection.on('error', function(){
			doneCallback(false);
		});
		
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x04, 1);
		buffer.writeUInt8(0xff, 2);
		
		dataConnection.write(buffer);
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
		
		var buffer = new Buffer(4);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x01, 1);
		buffer.writeUInt8(id, 2);
		buffer.writeUInt8(0xff, 3);
		
		dataConnection.write(buffer);
	}
}
