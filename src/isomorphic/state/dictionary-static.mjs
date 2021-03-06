
export function dictionaryStatic(dict) {
	var hop = Object.prototype.hasOwnProperty;
	return {
		has: function(key) { return dict ? hop.call(dict, key) : false },
		get: function(key) { return dict ? dict[key] : void 0 }
	};
}

export default dictionaryStatic;
