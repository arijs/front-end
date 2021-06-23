import browserstore from './browserstore.mjs';
import addStoreKey from './add-store-key.mjs';
import addMultiKey from './add-multi-key.mjs';

let sync_ss = {
	s: ('object' === typeof window) && window.sessionStorage,
	type: 'sessionStorage',
	set: browserstore.set,
	get: browserstore.get,
	remove: browserstore.remove,
	removeAll: browserstore.removeAll,
	getAll: browserstore.getAll
};
sync_ss = addStoreKey(sync_ss);
sync_ss = addMultiKey(sync_ss);

export default sync_ss;
