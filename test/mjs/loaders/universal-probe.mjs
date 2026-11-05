// Probe for ajax-universal-suite: prints which loader the universal entry
// resolves to under the conditions this process was started with.
const universal = await import('@arijs/frontend/universal/loaders/ajax');
const client = await import('@arijs/frontend/client/loaders/ajax');
const server = await import('@arijs/frontend/server/loaders/ajax-net');

const side = universal === client ? 'client' : universal === server ? 'server' : 'unknown';
process.stdout.write(JSON.stringify({ side, keys: Object.keys(universal).sort() }));
