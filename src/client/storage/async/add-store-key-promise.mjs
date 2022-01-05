
export default function addStoreKeyPromise(s) {
	const { promise } = s
	promise.key = function key(k, expires, path, secure) {
		return {
			get: function() { return promise.get(k); },
			set: function(v) { return promise.set(k, v, expires, path, secure); },
			remove: function() { return promise.remove(k); },
		};
	};
	return (s);
}
