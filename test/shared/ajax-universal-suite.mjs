// Assertion suite for the universal ajax entry: both loaders expose the same
// surface, and `@arijs/frontend/universal/loaders/ajax` resolves to the right
// one under each condition. The resolution checks run a probe in a child
// process, since export conditions are fixed when Node starts.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// What a consumer of the universal entry may rely on, on either side.
export const UNIVERSAL_EXPORTS = [
	'AjaxError',
	'ajaxTypeJson',
	'createTypeParser',
	'default',
	'formatError',
	'loadAjax',
	'loadAjaxPromise',
	'parseGetError',
	'parseOptTypes',
	'parseResponse',
	'parseValidate',
	'respErrorType',
	'respGetType',
	'respTestTypes',
];

// What only one side has. Kept exact, so a new divergence fails here and gets
// documented in the README instead of slipping through.
export const CLIENT_ONLY = [
	'createResponseTypeParser',
	'responseArrayBufferParser',
	'responseBlobParser',
	'responseDocumentParser',
	'responseJsonParser',
	'responseTextParser',
];
export const SERVER_ONLY = [
	'httpProtocol',
	'httpsProtocol',
	'setDefaultEncoding',
];

function publicKeys(mod) {
	return Object.keys(mod).filter((k) => k !== '__esModule').sort();
}

export function checkSurface(client, server, label) {
	const clientKeys = publicKeys(client);
	const serverKeys = publicKeys(server);
	assert.deepEqual(clientKeys, [...UNIVERSAL_EXPORTS, ...CLIENT_ONLY].sort(), `${label}: client exports`);
	assert.deepEqual(serverKeys, [...UNIVERSAL_EXPORTS, ...SERVER_ONLY].sort(), `${label}: server exports`);
	assert.equal(client.default, client.loadAjax, `${label}: client default is loadAjax`);
	assert.equal(server.default, server.loadAjax, `${label}: server default is loadAjax`);
	// Shared through isomorphic/loaders/ajax-common, so errors from either side
	// pass the same instanceof check.
	assert.equal(client.AjaxError, server.AjaxError, `${label}: one AjaxError`);
	assert.equal(client.formatError, server.formatError, `${label}: one formatError`);
	assert.equal(client.parseGetError, server.parseGetError, `${label}: one parseGetError`);
	console.log(`ajax universal surface (${label}): OK`);
}

/**
 * Runs `probePath` with and without `--conditions=browser`. The probe prints
 * JSON `{ side, keys }`, where side is which loader the universal entry gave.
 */
export function checkResolution(probePath, label) {
	const run = (args) => JSON.parse(execFileSync(process.execPath, [...args, probePath], { encoding: 'utf8' }));

	const node = run([]);
	assert.equal(node.side, 'server', `${label}: Node resolves the server loader`);
	assert.deepEqual(node.keys, [...UNIVERSAL_EXPORTS, ...SERVER_ONLY].sort(), `${label}: Node keys`);

	const browser = run(['--conditions=browser']);
	assert.equal(browser.side, 'client', `${label}: browser condition resolves the client loader`);
	assert.deepEqual(browser.keys, [...UNIVERSAL_EXPORTS, ...CLIENT_ONLY].sort(), `${label}: browser keys`);

	console.log(`ajax universal resolution (${label}): OK (node + browser)`);
}
