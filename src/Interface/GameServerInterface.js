
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
}
 
 