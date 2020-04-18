
export function arrayFrom(val) {
	var slice = Array.prototype.slice;
	switch (true) {
		case val instanceof Array: return val;
		case void 0 == val: return [];
		case isCollection(val): return slice.call(val);
		default: return [val];
	}
}

export function isCollection(obj) {
	var hop = Object.prototype.hasOwnProperty;
	var propEnum = Object.prototype.propertyIsEnumerable;
	return obj &&
		hop.call(obj, 'length') &&
		!propEnum.call(obj, 'length') &&
		parseInt(obj.length) === obj.length;
}
