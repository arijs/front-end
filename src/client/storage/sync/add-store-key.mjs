
export default function addStoreKey(s) {
	s.key = function key(k) {
		return {
			get: function() { return s.get(k); },
			set: function(v) { return s.set(k, v); },
			remove: function() { return s.remove(k); }
		};
	};
	return (s);
}
