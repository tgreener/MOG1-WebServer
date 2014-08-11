
/*
 * GameResponseParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 10.8.2014 (Aug 10, 2014)
 * 
 */

module.exports = new function() {
	this.parseBoolResponse = function(data) {
		return data.readUInt8(0) > 0
	}
}