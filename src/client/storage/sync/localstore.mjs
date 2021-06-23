import browserstore from './browserstore.mjs';
import addStoreKey from './add-store-key.mjs';
import addMultiKey from './add-multi-key.mjs';

let sync_ls = {
	s: ('object' === typeof window) && window.localStorage,
	type: 'localStorage',
	set: browserstore.set,
	get: browserstore.get,
	remove: browserstore.remove,
	removeAll: browserstore.removeAll,
	getAll: browserstore.getAll
};
sync_ls = addStoreKey(sync_ls);
sync_ls = addMultiKey(sync_ls);

export default sync_ls;
