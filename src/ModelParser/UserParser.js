
/*
 * UserParser.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

var stringUtil = require('./../Utils/StringUtil');

module.exports = new function() {
	this.parseUserResponse = function(data) {
		var valSize = 4;
		var readIndex = 0;
		
		if(data.bufferReadUInt32LE(readIndex) > 0) {
			readIndex += valSize;
			
			var UserData = {
				id : data.readBufferUInt32LE(readIndex + (valSize * 0)),
				locationID : data.readBufferUInt32LE(readIndex + (valSize * 1)),
				tag : data.toString('utf8', readIndex + (valSize * 2))
			}
			
			return userData;
		}
		
		return false;
	}
	
	this.parseAllUsersResponse = function(data) {
		if(data[0] > 0) {
			var allUserData = [];
			var valSize = data[1];
			var bufferReadFunction = 0;
		
			bufferReadFunction = dataUtil.getBufferReadFunction(valSize, data);
		
			var dataLength = bufferReadFunction(2);
			var responseReadIndex = 2 + valSize;
		
			while(responseReadIndex < dataLength && data[responseReadIndex] != 0xff) {
				var userID = bufferReadFunction(responseReadIndex + (valSize * 0));
				var userLoc = bufferReadFunction(responseReadIndex + (valSize * 1));
				
				var startOfStringIndex = responseReadIndex + (valSize * 2);
			
				var endOfNameStringIndex = stringUtil.findNullTerminator(data, startOfStringIndex);
				var userTag = data.toString('utf8', startOfStringIndex, endOfNameStringIndex);
			
				var userData = {
					id : userID,
					locationID : userLoc,
					tag : userTag
				}
			
				responseReadIndex += ((valSize * 2) + poiName.length + 1);
			
				allUserData.push(userData);
			}
		
			return allPOIData;
		}
	}
}
