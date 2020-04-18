import browserstore from './browserstore';
import addStoreKey from './add-store-key';

export default addStoreKey({
	s: window.localStorage,
	type: 'localStorage',
	set: browserstore.set,
	get: browserstore.get,
	remove: browserstore.remove,
	removeAll: browserstore.removeAll,
	getAll: browserstore.getAll
});
