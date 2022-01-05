
export default function addStoreKeyAsync(s) {
	s.key = function key(k, expires, path, secure) {
		return {
			get: function(cb) { return s.get(k, cb); },
			set: function(v, cb) { return s.set(k, v, cb, expires, path, secure); },
			remove: function(cb) { return s.remove(k, cb); }
		};
	};
	return (s);
}
