
/*
 * POIParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

var stringUtil = require('./../Utils/StringUtil');
var dataUtil = require('./../Utils/DataUtil');

var bufferReadFunction = null;

module.exports = new function() {
	this.parsePointOfInterest = function(data, valSize) {
		if(typeof valSize === 'undefined' || !valSize) {
			valSize = 4;
		}
		
		var responseReadIndex = 0;
		bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
		var poiData = {
			id : bufferReadFunction.call(data, valSize * 0),
			locationID : bufferReadFunction.call(data, valSize * 1),
			soil : bufferReadFunction.call(data, valSize * 2),
			stone : bufferReadFunction.call(data, valSize * 3),
			wild : bufferReadFunction.call(data, valSize * 4),
			population : bufferReadFunction.call(data, valSize * 5),
			poiName : stringUtil.stringFromBuffer(data, valSize * 6),
		};
	
		return poiData;
	}
	
	this.parsePOIList = function(data, valSize) {
		var allPOIData = [];
		var responseReadIndex = 0;
		var slicedBuffer = data;
		
		bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
		while(responseReadIndex < data.length) {
			
			var poiData = this.parsePointOfInterest(slicedBuffer);
			allPOIData.push(poiData);
			
			var bytesRead = ((valSize * 6) + poiData.poiName.length + 1);
			responseReadIndex += bytesRead;
		
			slicedBuffer = slicedBuffer.slice(bytesRead);
		}
	
		return allPOIData;
	}
	
	this.parsePOIResponse = function(data) {
		if(data[0] > 0) {
			return parsePointOfInterest(data.slice(1));
		}
		
		return false;
	}

	this.parseAllPOIResponse = function(data) {
		if(data[0] > 0) {
			var valSize = data[1];
			bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
			var dataLength = bufferReadFunction.call(data, 2);
			var responseReadIndex = 2 + valSize;
			
			var slicedBuffer = data.slice(responseReadIndex, data.length - 1);
		
			return this.parsePOIList(slicedBuffer, valSize);
		}
	}
}
 