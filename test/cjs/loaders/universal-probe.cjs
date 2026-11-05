// Probe for ajax-universal-suite: prints which loader the universal entry
// resolves to under the conditions this process was started with.
const universal = require('@arijs/frontend/universal/loaders/ajax');
const client = require('@arijs/frontend/client/loaders/ajax');
const server = require('@arijs/frontend/server/loaders/ajax-net');

const side = universal === client ? 'client' : universal === server ? 'server' : 'unknown';
const keys = Object.keys(universal).filter((k) => k !== '__esModule').sort();
process.stdout.write(JSON.stringify({ side, keys }));
