
export default function addMultiKeyAsync(api) {
	api.multiKey = function(listKey, sep) {
		var index = api.key(listKey);
		function indexUpdate(mod, cb) {
			index.get(function(err, data) {
				if (err) return cb(err);
				data = mod(data || {});
				// data[k] = true;
				index.set(data, cb);
			});
		}
		return {
			index: index,
			key: function(subKey, expires, path, secure) {
				var k = listKey+(sep||'')+subKey;
				var sub = api.key(k, expires, path, secure);
				return {
					get: sub.get,
					set: function(v, cb) {
						sub.set(v, function(err) {
							if (!err) indexUpdate(function(data) {
								data[subKey] = v == null ? void 0 : true;
								return data;
							}, function(){});
							cb(err);
						});
					},
					remove: function(cb) {
						sub.remove(function(err) {
							if (!err) indexUpdate(function(data) {
								data[subKey] = void 0;
								return data;
							}, function(){});
							cb(err);
						});
					}
				};
			}
		};
	};
	return api;
}
