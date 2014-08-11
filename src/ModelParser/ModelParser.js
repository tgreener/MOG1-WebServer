
/*
 * ModelParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 6.8.2014 (Aug 6, 2014)
 * 
 */

var userParser = require('./UserParser');
var poiParser = require('./POIParser');

module.exports = new function() {
	this.userParser = userParser;
	this.poiParser = poiParser;
	
	this.getNewModelID = function(data) {
		if(data.readUInt8(0) > 0) {
			return data.readUInt32LE(1);
		}
		else {
			return false;
		}
		
	}
}
