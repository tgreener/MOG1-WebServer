
/*
 * DataUtil.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

module.exports = new function() {
	
	this.getBufferReadFunction = function(valSize, data) {
		var bufferReadFunction;
		
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
			return null;
			break;
		}
		}
		
		return bufferReadFunction;
	}
	
}
