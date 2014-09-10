
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
			bufferReadFunction = data.readUInt8;
			break;
		}
		case 2: {
			bufferReadFunction = data.readUInt16LE;
			break;
		}
		case 4: {
			bufferReadFunction = data.readUInt32LE;
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
