
/*
 * POIParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

var stringUtil = require('./../Utils/StringUtil');

module.exports = new function() {
	this.parsePOIResponse = function(data) {
		if(data[0] > 0) {
			var valSize = 4;
			var responseReadIndex = 1;
			var poiData = {
				id : data.readUInt32LE(responseReadIndex + (valSize * 0)),
				locationID : data.readUInt32LE(responseReadIndex + (valSize * 1)),
				soil : data.readUInt32LE(responseReadIndex + (valSize * 2)),
				stone : data.readUInt32LE(responseReadIndex + (valSize * 3)),
				wild : data.readUInt32LE(responseReadIndex + (valSize * 4)),
				population : data.readUInt32LE(responseReadIndex + (valSize * 5)),
				poiName : data.toString('utf8', responseReadIndex + (valSize * 6)),
			};
		
			return poiData;
		}
	}

	this.parseAllPOIResponse = function(data) {
		if(data[0] > 0) {
			var allPOIData = [];
			var valSize = data[1];
			var bufferReadFunction = 0;
		
			switch(valSize) {
			case 1: {
				bufferReadFunction = data.readUInt8.bind(data);
				break;
			}
			case 2: {
				bufferReadFunction = data.readUInt16LE.bind(data);
				break;
			}
			case 4: {
				bufferReadFunction = data.readUInt32LE.bind(data);
				break;
			}
			default: {
				return false;
				break;
			}
			}
		
			var dataLength = bufferReadFunction(2);
			var responseReadIndex = 2 + valSize;
		
			while(responseReadIndex < dataLength && data[responseReadIndex] != 0xff) {
				var poiID = bufferReadFunction(responseReadIndex + (valSize * 0));
				var poiLoc = bufferReadFunction(responseReadIndex + (valSize * 1));
				var poiSoil = bufferReadFunction(responseReadIndex + (valSize * 2));
				var poiStn = bufferReadFunction(responseReadIndex + (valSize * 3));
				var poiWld = bufferReadFunction(responseReadIndex + (valSize * 4));
				var poiPop = bufferReadFunction(responseReadIndex + (valSize * 5));
			
				var startOfStringIndex = responseReadIndex + (valSize * 6);
			
				var endOfNameStringIndex = stringUtil.findNullTerminator(data, startOfStringIndex);
				var poiName = data.toString('utf8', startOfStringIndex, endOfNameStringIndex);
			
				var poiData = {
					id : poiID,
					locationID: poiLoc,
					soil : poiSoil,
					stone : poiStn,
					wilderness : poiWld,
					population : poiPop,
					poiName : poiName
				};
			
				responseReadIndex += ((valSize * 6) + poiName.length + 1);
			
				allPOIData.push(poiData);
			}
		
			return allPOIData;
		}
	}
}
 