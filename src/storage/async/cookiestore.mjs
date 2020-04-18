import cookiestore from '../sync/cookiestore';
import syncAdapter from './sync-adapter';
import addStoreKeyAsync from './add-store-key-async';
import addMultiKeyAsync from './add-store-key-async';

cookiestore = syncAdapter(cookiestore);
cookiestore = addStoreKeyAsync(cookiestore);
cookiestore = addMultiKeyAsync(cookiestore);

export default cookiestore;
