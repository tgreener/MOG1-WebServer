var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

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
	
	
	var poiResponse = function(data) {
		if(data[0] > 0) {
			var poiData = {
				id : data[1],
				soil : data[2],
				stone : data[3],
				wild : data[4],
				poiName : data.toString('utf8', 5)
			};
			
			socket.emit('POIResponse', poiData);
		}
	}
	
	socket.on('POIRequest', function(data) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', poiResponse);
		
		var id = data.id;
		
		var buffer = new Buffer(4);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x01, 1);
		buffer.writeUInt8(id, 2);
		buffer.writeUInt8(0xff, 3);
		
		dataConnection.write(buffer);
	});
	
	var findNullTerminator = function(buffer, offset) {
		var index = offset;
		while(index < buffer.length) {
			if(buffer[index] == 0) return index;
			index++;
		}
		
		return -1;
	}
	
	var allPOIResponse = function(data) {
		if(data[0] > 0) {
			var allPOIData = [];
			var dataLengthByteSize = data[1];
			var dataLength = 0;
			
			for(var i = 0; i < dataLengthByteSize; i++) {
				dataLength += data[2 + i] * Math.pow(2, dataLengthByteSize - (dataLengthByteSize - i));
			}
			
			var responseReadIndex = 2 + dataLengthByteSize;
			
			while(responseReadIndex < dataLength && data[responseReadIndex] != 0xff) {
				var poiID = data[responseReadIndex];
				var poiSoil = data[responseReadIndex + 1];
				var poiStone = data[responseReadIndex + 2];
				var poiWilderness = data[responseReadIndex + 3];
				
				var endOfNameString = findNullTerminator(data, responseReadIndex + 4);
				var poiName = data.toString('utf8', responseReadIndex + 4, endOfNameString);
				
				var poiData = {
					id : poiID,
					soil : poiSoil,
					stone : poiStone,
					wilderness : poiWilderness,
					poiName : poiName
				};
				
				responseReadIndex += (4 + poiName.length + 1);
				
				allPOIData.push(poiData);
			}
			
			socket.emit('POIResponseAll', allPOIData);
		}
	}
	
	socket.on('POIRequestAll', function(request) {
		var dataConnection = openDataConnection();
		dataConnection.on('data', allPOIResponse);
		
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x04, 1);
		buffer.writeUInt8(0xff, 2);
		
		dataConnection.write(buffer);
	});
	
	socket.on('yelp', function() {
		var dataConnection = openDataConnection();
		dataConnection.on('data', function(data) {
			console.log(data.toString());
		});
		
		var buffer = new Buffer(3);
		
		buffer.writeUInt8(0x04, 0);
		buffer.writeUInt8(0x04, 1);
		buffer.writeUInt8(0xff, 2);
		
		dataConnection.write(buffer);
	});
	
	socket.on('disconnect', function() {
	});
});
