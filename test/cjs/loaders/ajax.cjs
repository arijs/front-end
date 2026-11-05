// Assertion test: the ajax loaders on lib/, and the universal entry.
const path = require('node:path');
const client = require('@arijs/frontend/client/loaders/ajax');
const server = require('@arijs/frontend/server/loaders/ajax-net');

(async () => {
	const { runAjaxClientSuite } = await import('../../shared/ajax-client-suite.mjs');
	const { runAjaxNetSuite } = await import('../../shared/ajax-net-suite.mjs');
	const { checkSurface, checkResolution } = await import('../../shared/ajax-universal-suite.mjs');

	await runAjaxClientSuite(client, 'cjs');
	await runAjaxNetSuite(server, 'cjs');
	checkSurface(client, server, 'cjs');
	checkResolution(path.join(__dirname, 'universal-probe.cjs'), 'cjs');
})().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
