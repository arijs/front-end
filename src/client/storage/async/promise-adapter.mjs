
export default function asyncAdapterPromise(api) {
	api.promise = {
		set: function(key, val, expires, path, secure) {
			return new Promise((resolve, reject) => {
				api.set(key, val, err => err ? reject(err) : resolve(), expires, path, secure);
			});
		},
		get: function(key) {
			return new Promise((resolve, reject) => {
				api.get(key, (err, val) => err ? reject(err) : resolve(val));
			});
		},
		remove: function(key) {
			return new Promise((resolve, reject) => {
				api.remove(key, err => err ? reject(err) : resolve());
			});
		},
		removeAll: function() {
			return new Promise((resolve, reject) => {
				api.removeAll(err => err ? reject(err) : resolve());
			});
		},
		getAll: function() {
			return new Promise((resolve, reject) => {
				api.getAll((err, val) => err ? reject(err) : resolve(val));
			});
		}
	};
	return api;
}
