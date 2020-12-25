
export default function syncAdapterAsync(api) {
	return {
		s: api.s,
		type: api.type,
		set: function(key, val, cb, expires, path, secure) {
			try {
				api.set(key, val, expires, path, secure);
			} catch(e) {
				return cb(e);
			}
			return cb();
		},
		get: function(key, cb) {
			var val;
			try {
				val = api.get(key);
			} catch(e) {
				return cb(e, val);
			}
			return cb(null, val);
		},
		remove: function(key, cb) {
			try {
				api.remove(key);
			} catch(e) {
				return cb(e);
			}
			return cb();
		},
		removeAll: function(cb) {
			try {
				api.removeAll();
			} catch(e) {
				return cb(e);
			}
			return cb();
		},
		getAll: function(cb) {
			var val;
			try {
				val = api.getAll();
			} catch(e) {
				return cb(e, val);
			}
			return cb(null, val);
		}
	};
}
