import browserstore from './browserstore.mjs';
import addStoreKey from './add-store-key.mjs';

export default addStoreKey({
	s: ('object' === typeof window) && window.sessionStorage,
	type: 'sessionStorage',
	set: browserstore.set,
	get: browserstore.get,
	remove: browserstore.remove,
	removeAll: browserstore.removeAll,
	getAll: browserstore.getAll
});
