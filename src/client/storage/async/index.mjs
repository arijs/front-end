import localstore from './localstore';
import sessionstore from './sessionstore';
import cookiestore from './cookiestore';
import capacitorstore from './capacitor';

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
