
/*
 * GameServerInterface.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 10.8.2014 (Aug 10, 2014)
 * 
 */
 
module.exports = new function() {
	
	this.connectUserBuffer = function() {
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x02, 0);
		buffer.writeUInt8(0x01, 1);
		
		// Later I'll wanna pass other variables, but not now.
		
		buffer.writeUInt8(0xff, 2);
		
		return buffer;
	}
	
	this.disconnectUserBuffer = function(id) {
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x02, 0);
		buffer.writeUInt8(0x02, 1);
		
		// Later I'll wanna pass other variables, but not now.
		
		buffer.writeUInt8(0xff, 2);
		
		return buffer;
		
	}
	
	this.userLocationBuffer = function(id) {
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x02, 0);
		buffer.writeUInt8(0x03, 1);
		
		// Later I'll wanna pass other variables, but not now.
		
		buffer.writeUInt8(0xff, 2);
		
		return buffer;
	}
	
	this.poisFromPlayerBuffer = function(id) {
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x02, 0);
		buffer.writeUInt8(0x04, 1);
		
		// Later I'll wanna pass other variables, but not now.
		
		buffer.writeUInt8(0xff, 2);
		
		return buffer;
	}
	
	this.moveUserBuffer = function(id, locID) {
		var valSize = 4;
		var bufferSize = 3 + (valSize * 2);
		var buffer = new Buffer(bufferSize);
		buffer.writeUInt8(0x02, 0);
		buffer.writeUInt8(0x05, 1);
		buffer.writeUInt32LE(id, 2);
		buffer.writeUInt32LE(locID, 2 + valSize);
		buffer.writeUInt8(0xff, bufferSize - 1);
		return buffer;
	}
}
 
 