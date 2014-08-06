
/*
 * UserInterface.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 6.8.2014 (Aug 6, 2014)
 * 
 */
 
module.exports = new function() {
	this.createUserBuffer = function(tag) {
		var tagLength = Buffer.byteLength(tag, 'utf8');
		
		var buffer = new Buffer(4 + tagLength);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x0a, 1);
		buffer.write(tag, 2, tagLength, 'utf8');
		buffer.writeUInt8(0x00, 2 + tagLength);
		buffer.writeUInt8(0xff, 3 + tagLength);
		
		return buffer;
	}
	
	this.userBuffer = function(id) {
		var buffer = new Buffer(7);
		buffer.writeUInt8(0x03, 0);
		buffer.writeUInt8(0x09, 1);
		buffer.writeUInt32LE(id, 2);
		buffer.writeUInt8(0xff, 3);
		
		return buffer;
	}
}
 