var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./src/GameServer');

io.attach(4010);

http.listen(80, function() {
	console.log('Serving web content.');
})

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('private/html/index.html');
});

io.on('connection', function(socket) {
	console.log('A user connected.');
	
	var userData = {};
	
	game.connectUser(function(id) {
		if(id) {
			userData.id = id;
			socket.emit('ConnectionResponse', true);
		}
		else {
			socket.emit('ConnectionResponse', false);
		}
	});
	
	var createRouteInfoForClient = function(userLocation) {
		var minimalConnectionData = [];
		
		for(var i = 0; i < userLocation.connectionInfo.length; i++) {
			var connectionInfo = userLocation.connectionInfo[i];
			minimalConnectionData[i] = new function() {
				this.connectedPOIName = connectionInfo.connectedPOI.poiName;
				this.eventHandle = this.connectedPOIName + String(connectionInfo.connectingRoute.id);
			}
		}
		
		return minimalConnectionData;
	}
	
	var createRouteEventHandler = function(handle, connection) {
		var runCount = 0;
		return function handler(anotherRequest) 
		{
			game.moveToLocation(userData.id, connection.connectedPOI.locationID, function(userDidMove){
				if(userDidMove) {
					userLocationRequest(anotherRequest);
				}
			});
		}
	}
	
	var setRouteEventHandlers = function(userLocation, minimalConnectionData) {
		var locationEventHandlers = [];
		var locationEventHandles = [];
		var numConnections = userLocation.connectionInfo.length;
		
		for(var i = 0; i < numConnections; i++) {
			var connectionInfo = userLocation.connectionInfo[i];
			
			locationEventHandles[i] = minimalConnectionData[i].eventHandle;
			
			var routeHandler = createRouteEventHandler(locationEventHandles[i], connectionInfo);
			locationEventHandlers[i] = (function(handler) {
				return function(request) {
					handler(request);
				
					for(var j = 0; j < numConnections; j++) {
						socket.removeListener(locationEventHandles[j], locationEventHandlers[j]);
					}
				}
			})(routeHandler)
			
			socket.on(locationEventHandles[i], locationEventHandlers[i]);
		}
	}
	
	var userLocationRequest = function(request) {
		if(userData.id > 0) {
			game.getLocation(userData.id, function(userLocation) {
				if(userLocation) {
					userData.currentLocation = userLocation;
					
					var minimalConnectionData = createRouteInfoForClient(userLocation);
					setRouteEventHandlers(userLocation, minimalConnectionData);
					
					var minimalLocationData = {
						currentPOI : userLocation.currentPOI,
						connectionData : minimalConnectionData
					}
					
					socket.emit('UserLocationResponse', minimalLocationData);
				}
			});
		}
	}
	
	socket.on('UserLocationRequest', userLocationRequest);
	
	socket.on('disconnect', function() {
		game.disconnectUser(1, function(){ /* This callback just doesn't even care atm. */ });
		console.log('A user disconnected.');
	});
});
