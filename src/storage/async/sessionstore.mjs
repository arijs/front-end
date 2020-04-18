import sessionstore from '../sync/sessionstore';
import syncAdapter from './sync-adapter';
import addStoreKeyAsync from './add-store-key-async';
import addMultiKeyAsync from './add-store-key-async';

sessionstore = syncAdapter(sessionstore);
sessionstore = addStoreKeyAsync(sessionstore);
sessionstore = addMultiKeyAsync(sessionstore);

export default sessionstore;
