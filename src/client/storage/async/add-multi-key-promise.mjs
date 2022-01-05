
export default function addMultiKeyPromise(api) {
	const { promise } = api
	promise.multiKey = function(listKey, sep, lExpires, lPath, lSecure) {
		var index = promise.key(listKey, lExpires, lPath, lSecure);
		async function indexUpdate(mod) {
			const data = await index.get();
			data = mod(data || {});
			// data[k] = true;
			return await index.set(data);
		}
		return {
			index: index,
			key: function(subKey, expires, path, secure) {
				var k = listKey+(sep||'')+subKey;
				var sub = promise.key(k, expires, path, secure);
				return {
					get: sub.get,
					set: async function(v) {
						await sub.set(v);
						await indexUpdate(function(data) {
							data[subKey] = v == null ? void 0 : true;
							return data;
						});
					},
					remove: async function() {
						await sub.remove();
						await indexUpdate(function(data) {
							data[subKey] = void 0;
							return data;
						});
					},
				};
			},
		};
	};
	return api;
}
