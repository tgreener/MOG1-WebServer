
/*
 * POIInterface.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 6.8.2014 (Aug 6, 2014)
 * 
 */

module.exports = new function() {
	this.allPOIsBuffer = function() {
		var buffer = new Buffer(3);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x04, 1);
		buffer.writeUInt8(0xff, 2);
		
		return buffer;
	};
	
	this.poiBuffer = function(id) {
		var buffer = new Buffer(4);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x01, 1);
		buffer.writeUInt8(id, 2);
		buffer.writeUInt8(0xff, 3);
		
		return buffer;
	}
}
