import localstore from './localstore';
import sessionstore from './sessionstore';
import cookiestore from './cookiestore';

let store;

if (localstore.s) {
	store = localstore;
} else {
	store = cookiestore;
}

store.local = localstore;
store.session = sessionstore;
store.cookie = cookiestore;

export default store;
