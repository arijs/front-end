import sessionstore from '../sync/sessionstore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';

let async_ss = sessionstore;
async_ss = syncAdapter(async_ss);
async_ss = addStoreKeyAsync(async_ss);
async_ss = addMultiKeyAsync(async_ss);

export default async_ss;
