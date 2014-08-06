
/*
 * DataServerInterface.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 6.8.2014 (Aug 6, 2014)
 * 
 */

var poiInterface = require('./POIInterface');
var userInterface = require('./UserInterface');

module.exports = new function() {
	this.allPOIsBuffer = poiInterface.allPOIsBuffer;
	this.poiBuffer = poiInterface.poiBuffer;
	this.createUserBuffer = userInterface.createUserBuffer;
	this.userBuffer = userInterface.userBuffer;
}
