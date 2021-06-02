import localstore from './localstore.mjs';
import sessionstore from './sessionstore.mjs';
import cookiestore from './cookiestore.mjs';
import capacitorstore from './capacitor.mjs';

let store;

if (capacitorstore.s) {
	store = capacitorstore;
} else {
	store = localstore;
}

store.capacitor = capacitorstore;
store.local = localstore;
store.session = sessionstore;
store.cookie = cookiestore;

export default store;
