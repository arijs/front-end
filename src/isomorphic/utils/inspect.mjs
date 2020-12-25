
export function inspectVal(obj, maxLen) {
	var toStr = Object.prototype.toString;
	var str = obj instanceof Object ? toStr.call(obj) :
		obj && 'object' === typeof obj ? `{${Object.keys(obj).join()}}` :
		String(obj);
	return maxLen && maxLen > 0 ? str.substr(0, maxLen) : str;
}

export function inspectObj(obj, level, maxLen) {
	level = +level || 0;
	if ('object' === typeof obj && level > 0) {
		var map = {};
		for (var k in obj) {
			map[k] = inspectObj(obj[k], level - 1, maxLen);
		}
		return map;
	} else {
		return inspectVal(obj, maxLen);
	}
}

export default inspectObj;
