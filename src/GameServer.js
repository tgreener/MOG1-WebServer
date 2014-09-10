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
var gameInterface = require('./Interface/GameServerInterface');
var gameResponseParser = require('./GameResponseParser');
var poiParser = modelParser.poiParser;

var openDataConnection = function() {
	var dataConnection = net.createConnection('../GameDataServer/connection', function() {
		// console.log('Connected to data server!');
	});
	
	dataConnection.on('end', function() {
		// console.log('Connection to data server closed!');
	});

	dataConnection.on('error', function(err) {
		console.log('Error in data connection!');
		console.log(err);
	});
	
	return dataConnection;
}

var errorResponse = function(doneCallback) {
		return function() {
			doneCallback(false);
		}
}

var outgoingConnectionsResponse = function(currentPOI) {
	return function(data) {
		var routesInfo = gameResponseParser.parseRoutesWithEndpointsResponse(data);
		var connectedPOIs = routesInfo.pois;
		var routesOut = routesInfo.routes;
	
		var connectionInfo = [];
	
		for(var i = 0; i < connectedPOIs.length; i++) {
			connectionInfo[i] = {
				connectedPOI : connectedPOIs[i],
				connectingRoute : routesOut[i]
			}
		}
	
		var result = {
			currentPOI : currentPOI,
			connectionInfo : connectionInfo
		}
	
		return result;
	}
}

var outgoingConnectionsRequest = function(id, doneCallback, currentPOI) {
	return function() {
		var secondConnection = openDataConnection();

		secondConnection.on('data', function(data){
			var result = (outgoingConnectionsResponse(currentPOI))(data);
			doneCallback(result);
		});
		secondConnection.on('error', errorResponse(doneCallback));

		var poisFromPlayerBuffer = gameInterface.poisFromPlayerBuffer(id);
		secondConnection.write(poisFromPlayerBuffer);
	}
}

module.exports = new function() {
	this.getLocation = function(id, doneCallback) {
		var dataConnection = openDataConnection();
		var currentPOI;
		
		dataConnection.on('data', function(data) {
			currentPOI = gameResponseParser.parseUserLocationResponse(data);
		});
		dataConnection.on('error', errorResponse(doneCallback));
		
		dataConnection.on('end', function(){
			(outgoingConnectionsRequest(id, doneCallback, currentPOI))();
		});
		
		var userLocationBuffer = gameInterface.userLocationBuffer(id);
		dataConnection.write(userLocationBuffer);
	}
	
	this.moveToLocation = function(userID, locationID, callback) {
		// console.log(locationID);
		var dataConnection = openDataConnection();
		
		dataConnection.on('data', function(data) {
			callback(gameResponseParser.parseBoolResponse(data));
		});
		dataConnection.on('error', errorResponse(callback));
		
		var moveUserBuffer = gameInterface.moveUserBuffer(userID, locationID);
		dataConnection.write(moveUserBuffer);
	}
	
	this.connectUser = function(callback) {
		var connectedUserID = -1;
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data) {
			callback(modelParser.getNewModelID(data));
		});
		dataConnection.on('error', function() {
			callback(false);
		}); 
		
		var connectUserBuffer = gameInterface.connectUserBuffer();
		dataConnection.write(connectUserBuffer);
	}
	
	this.disconnectUser = function(id, callback) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data) {
			callback(gameResponseParser.parseBoolResponse(data));
		});
		dataConnection.on('error', function() {
			callback(false);
		});
		
		var disconnectUserBuffer = gameInterface.disconnectUserBuffer(id);
		dataConnection.write(disconnectUserBuffer);
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
