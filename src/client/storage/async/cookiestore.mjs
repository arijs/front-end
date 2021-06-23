import cookiestore from '../sync/cookiestore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';

let async_cs = cookiestore;
async_cs = syncAdapter(async_cs);
async_cs = addStoreKeyAsync(async_cs);
async_cs = addMultiKeyAsync(async_cs);

export default async_cs;
