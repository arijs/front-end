import localstore from './localstore.mjs';
import sessionstore from './sessionstore.mjs';
import cookiestore from './cookiestore.mjs';

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
