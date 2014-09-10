
/*
 * GameResponseParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 10.8.2014 (Aug 10, 2014)
 * 
 */

var poiParser = require('./ModelParser/POIParser');
var routeParser = require('./ModelParser/RouteParser');
var dataUtil = require('./Utils/DataUtil');

module.exports = new function() {
	var LOC_TYPES = {POI : 0, ROUTE : 1};
	
	this.parseUserLocationResponse = function(data) {
		if(data[0] <= 0) return false;
		
		var locationType = data.readUInt8(1);
		if(locationType == LOC_TYPES.POI) {
			return poiParser.parsePointOfInterest(data.slice(2));
		}
		
		return false;
	}
	
	this.parsePOIListResponse = function(rawPOIList) {
		return poiParser.parseAllPOIResponse(rawPOIList);
	}
	
	this.parseRoutesWithEndpointsResponse = function(data) {
		if(data[0] > 0) {
			var valSize = data[1];
			var bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
			
			// there are four bytes of unsigned int to say how long the data is,
			// but it's redundant in this situation.
			var responseReadIndex = 2 + valSize;
			
			// Need to find zero bytes that mark end of the route
			// objects and the beginning of the POIs.
			var readVal = -1;
			var i = 0;
			var dataWithoutHeader = data.slice(responseReadIndex);
			
			while(readVal != 0 && i < data.length) {
				i += valSize * 7;
				var slice = dataWithoutHeader.slice(i);
				readVal = bufferReadFunction.call(slice, 0);
			}
			
			
			
			if(i < data.length) {
				var routes = routeParser.parseRouteList(dataWithoutHeader.slice(0, i), valSize);
				
				i += valSize; // Move index past zero byte marker
				var poiData = dataWithoutHeader.slice(i, dataWithoutHeader.length - 1);
				var pois = poiParser.parsePOIList(poiData, valSize);
				
				return {
					routes : routes,
					pois : pois
				}
			}
		}
		
		return false;
	}
	
	this.parseBoolResponse = function(data) {
		return data.readUInt8(0) > 0
	}
}