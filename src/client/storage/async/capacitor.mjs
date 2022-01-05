import allCallback from '../../../isomorphic/utils/all-callback.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';
import asyncAdapterPromise from './promise-adapter.mjs';
import addStoreKeyPromise from './add-store-key-promise.mjs';
import addMultiKeyPromise from './add-multi-key-promise.mjs';

let capacitorstore = {
	s: (function() {
		try {
			var s = Capacitor.Plugins.Storage;
			if (s
				&& s.get instanceof Function
				&& s.set instanceof Function
				&& s.remove instanceof Function
				&& s.clear instanceof Function
				&& s.keys instanceof Function
			) return s;
		} catch(e) {
		}
	})(),
	type: 'capacitorStorage',
	set: function(key, val, cb) {
		this.s.set({
			key: key,
			value: JSON.stringify(val)
		}).then(cb).catch(cb);
	},
	get: function(key, cb) {
		this.s.get({
			key: key
		}).then(function(ret) {
			var val = ret.value;
			if ('string' === typeof val) {
				try {
					val = JSON.parse(val);
				} catch(e) {}
			}
			cb(null, val);
		}).catch(cb);
	},
	remove: function(key, cb) {
		this.s.remove({
			key: key
		}).then(cb).catch(cb);
	},
	removeAll: function(cb) {
		this.s.clear().then(cb).catch(cb); 
	},
	getAll: function(cb) {
		var self = this;
		this.s.keys().then(function(keys) {
			keys = keys.keys;
			var c = keys.length;
			var item = allCallback({
				valueMap: {},
				errors: [],
				count: 0,
				keys: keys,
				onDone: function(err, value) {
					this.count++;
					this.valueMap[this._current] = value;
					if (err) this.errors.push(err);
				},
				onFinish: function() {
					var errors = this.errors;
					var ec = errors.length;
					var error = null;
					if (ec) {
						error = new Error(
							(1 == ec ? '1 Error' : ec+' Errors')+' getting '+
							this.count+' keys from capacitor storage'
						);
						error.list = errors;
					}
					cb(error, this.valueMap, this.keys);
				}
			});
			for (var i = 0; i < c; i++) {
				self.get(keys[i], item(keys[i]));
			}
		}).catch(cb);
	}
};

capacitorstore = addStoreKeyAsync(capacitorstore);
capacitorstore = addMultiKeyAsync(capacitorstore);
capacitorstore = asyncAdapterPromise(capacitorstore);
capacitorstore = addStoreKeyPromise(capacitorstore);
capacitorstore = addMultiKeyPromise(capacitorstore);

export default capacitorstore;
