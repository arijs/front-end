import sessionstore from '../sync/sessionstore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';
import asyncAdapterPromise from './promise-adapter.mjs';
import addStoreKeyPromise from './add-store-key-promise.mjs';
import addMultiKeyPromise from './add-multi-key-promise.mjs';

let async_ss = sessionstore;
async_ss = syncAdapter(async_ss);
async_ss = addStoreKeyAsync(async_ss);
async_ss = addMultiKeyAsync(async_ss);
async_ss = asyncAdapterPromise(async_ss);
async_ss = addStoreKeyPromise(async_ss);
async_ss = addMultiKeyPromise(async_ss);

export default async_ss;
