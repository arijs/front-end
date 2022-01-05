import cookiestore from '../sync/cookiestore.mjs';
import syncAdapter from './sync-adapter.mjs';
import addStoreKeyAsync from './add-store-key-async.mjs';
import addMultiKeyAsync from './add-multi-key-async.mjs';
import asyncAdapterPromise from './promise-adapter.mjs';
import addStoreKeyPromise from './add-store-key-promise.mjs';
import addMultiKeyPromise from './add-multi-key-promise.mjs';

let async_cs = cookiestore;
async_cs = syncAdapter(async_cs);
async_cs = addStoreKeyAsync(async_cs);
async_cs = addMultiKeyAsync(async_cs);
async_cs = asyncAdapterPromise(async_cs);
async_cs = addStoreKeyPromise(async_cs);
async_cs = addMultiKeyPromise(async_cs);

export default async_cs;
