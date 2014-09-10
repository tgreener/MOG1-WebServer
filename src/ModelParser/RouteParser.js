
/*
 * RouteParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 31.8.2014 (Aug 31, 2014)
 * 
 */
 
var stringUtil = require('./../Utils/StringUtil');
var dataUtil = require('./../Utils/DataUtil');
 
var bufferReadFunction = null;
 
module.exports = new function() {
	this.parseRoute = function(data, valSize) {
		if(typeof valSize === 'undefined' || !valSize) {
			valSize = 4;
		}
		
		var responseReadIndex = 0;
		bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
		var id = bufferReadFunction.call(data, valSize * 0);
		var loc = bufferReadFunction.call(data, valSize * 1);
		var poia = bufferReadFunction.call(data, valSize * 2);
		var poib = bufferReadFunction.call(data, valSize * 3);
		var diff = bufferReadFunction.call(data, valSize * 4);
		var bidirectional = bufferReadFunction.call(data, valSize * 5);
		var reversed = bufferReadFunction.call(data, valSize * 6);
		
		var routeData = {
			id : id,
			locationID : loc,
			poiA : poia,
			poiB : poib,
			difficulty : diff,
			bidirectional : bidirectional,
			reversed : reversed,
		};
	
		return routeData;
	}
	
	this.parseRouteList = function(data, valSize) {
		var allRouteData = [];
		var responseReadIndex = 0;
		var slicedBuffer = data;
		
		bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
		while(responseReadIndex < data.length) {
			
			var routeData = this.parseRoute(slicedBuffer);
			allRouteData.push(routeData);
			
			var bytesRead = (valSize * 7);
			responseReadIndex += bytesRead;
		
			slicedBuffer = slicedBuffer.slice(bytesRead);
		}
	
		return allRouteData;
	}
}
 
 