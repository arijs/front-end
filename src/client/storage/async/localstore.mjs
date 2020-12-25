import localstore from '../sync/localstore';
import syncAdapter from './sync-adapter';
import addStoreKeyAsync from './add-store-key-async';
import addMultiKeyAsync from './add-store-key-async';

localstore = syncAdapter(localstore);
localstore = addStoreKeyAsync(localstore);
localstore = addMultiKeyAsync(localstore);

export default localstore;
