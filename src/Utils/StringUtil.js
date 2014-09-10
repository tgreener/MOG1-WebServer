
/*
 * StringUtil.js
 * by Todd Greener
 * todd.greener@gmail.com
 * 5.8.2014 (Aug 5, 2014)
 * 
 */

module.exports = new function() { 
	this.stringFromBuffer = function(buffer, startIndex) {
		var endIndex = this.findNullTerminator(buffer, startIndex);
		return buffer.toString('utf8', startIndex, endIndex);
	}
	
	this.findNullTerminator = function(buffer, offset) {
		var index = offset;
		while(index < buffer.length) {
			if(buffer[index] == 0) return index;
			index++;
		}
	
		return -1;
	}
}
