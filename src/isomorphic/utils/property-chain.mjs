
export function get(obj, list, vDefault) {
	var c = list.length, i = 0;
	var hop = Object.prototype.hasOwnProperty;
	for (; i < c; i++) {
		var k = list[i];
		if (hop.call(obj, k)) {
			if (c == (i + 1)) {
				return obj[k];
			} else {
				obj = obj[k];
				if (!obj) return vDefault;
			}
		} else {
			return vDefault;
		}
	}
	return obj;
}

export function set(obj, list, value) {
	var c = list.length - 1;
	var hop = Object.prototype.hasOwnProperty;
	var next = void 0;
	for (var i = 0; i < c; i++) {
		var k = list[i];
		if (hop.call(obj, k)) next = obj[k];
		if (!(next instanceof Object)) {
			next = obj[k] = {};
		}
		obj = next;
		next = void 0;
	}
	k = list[i];
	obj[k] = value;
	return value;
}

export default get;
