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
	
	var userID = -1;
	singleConnectionTaken = true;
	
	game.connectUser(function(id) {
		if(id) userID = id;
	});
	
	socket.on('POIRequest', function(request) {
		game.getPOI(request, function(result){
			socket.emit('POIResponse', result);
		});
	});
	
	socket.on('POIRequestAll', function(request) {
		game.getAllPOIs(function(result) {
			socket.emit('POIResponseAll', result);
		});
	});
	
	socket.on('disconnect', function() {
		game.disconnectUser(1, function(){ /* This callback just doesn't even care atm. */ });
		console.log('A user disconnected.');
	});
});
