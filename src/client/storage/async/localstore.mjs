import localstore from '../sync/localstore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-store-key-async.mjs';

let async_ls = localstore;
async_ls = syncAdapter(async_ls);
async_ls = addStoreKeyAsync(async_ls);
async_ls = addMultiKeyAsync(async_ls);

export default async_ls;
