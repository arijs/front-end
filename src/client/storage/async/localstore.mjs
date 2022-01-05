import localstore from '../sync/localstore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';
import asyncAdapterPromise from './promise-adapter.mjs';
import addStoreKeyPromise from './add-store-key-promise.mjs';
import addMultiKeyPromise from './add-multi-key-promise.mjs';

let async_ls = localstore;
async_ls = syncAdapter(async_ls);
async_ls = addStoreKeyAsync(async_ls);
async_ls = addMultiKeyAsync(async_ls);
async_ls = asyncAdapterPromise(async_ls);
async_ls = addStoreKeyPromise(async_ls);
async_ls = addMultiKeyPromise(async_ls);

export default async_ls;
