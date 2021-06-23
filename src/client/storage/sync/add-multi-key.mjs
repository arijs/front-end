
export default function addMultiKey(api) {
	api.multiKey = function(listKey, sep) {
		var index = api.key(listKey);
		function indexUpdate(mod) {
			var data = index.get();
			data = mod(data || {});
			// data[k] = true;
			index.set(data);
		}
		return {
			index: index,
			key: function(subKey) {
				var k = listKey+(sep||'')+subKey;
				var sub = api.key(k);
				return {
					get: sub.get,
					set: function(v) {
						sub.set(v);
						indexUpdate(function(data) {
							data[subKey] = v == null ? void 0 : true;
							return data;
						});
					},
					remove: function() {
						sub.remove();
						indexUpdate(function(data) {
							data[subKey] = void 0;
							return data;
						});
					}
				};
			}
		};
	};
	return api;
}
