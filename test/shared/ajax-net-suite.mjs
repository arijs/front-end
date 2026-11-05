// Assertion suite for server/loaders/ajax-net against a local HTTP server.
// Receives the module under test, so the ESM half runs it on src/ and the
// CommonJS half on lib/.
import assert from 'node:assert/strict';
import http from 'node:http';

function startServer() {
	const server = http.createServer((req, res) => {
		let body = '';
		req.setEncoding('utf8');
		req.on('data', (chunk) => { body += chunk; });
		req.on('end', () => {
			if (req.url === '/fail') {
				res.writeHead(500, 'Internal Server Error', { 'Content-Type': 'text/plain' });
				res.end('boom');
				return;
			}
			if (req.url === '/text') {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('plain');
				return;
			}
			if (req.url === '/badjson') {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end('{"broken"');
				return;
			}
			if (req.url === '/slow') {
				// Headers now, body only when the test calls server.release().
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.write('partial');
				server.release = () => res.end(' rest');
				return;
			}
			// Echo what arrived, so each check can look at it in resp.data.
			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			res.end(JSON.stringify({
				method: req.method,
				url: req.url,
				headers: req.headers,
				body,
			}));
		});
	});
	return new Promise((resolve) => {
		server.listen(0, '127.0.0.1', () => resolve(server));
	});
}

export async function runAjaxNetSuite(mod, label) {
	const { loadAjaxPromise, ajaxTypeJson, AjaxError } = mod;
	const server = await startServer();
	const { port } = server.address();
	const base = `http://127.0.0.1:${port}`;
	const body = JSON.stringify({ greeting: 'olá, ação' });
	let checks = 0;

	try {
		// POST with `url`, `method`, headers as a { name, value } list, and a body.
		{
			const resp = await loadAjaxPromise({
				method: 'POST',
				url: `${base}/echo`,
				headers: [
					{ name: 'Content-Type', value: 'application/json' },
					null,
					{ name: '', value: 'skipped' },
					{ name: 'X-Arijs', value: 'list' },
				],
				body,
				typeExpect: ajaxTypeJson,
			});
			assert.ok(!resp.error, 'list headers: no error');
			assert.equal(resp.data.method, 'POST', 'list headers: method');
			assert.equal(resp.data.url, '/echo', 'list headers: path');
			assert.equal(resp.data.headers['content-type'], 'application/json', 'list headers: content-type');
			assert.equal(resp.data.headers['x-arijs'], 'list', 'list headers: custom header');
			assert.ok(!Object.values(resp.data.headers).includes('skipped'), 'list headers: empty name skipped');
			assert.equal(resp.data.body, body, 'list headers: body');
			assert.equal(resp.data.headers['content-length'], String(Buffer.byteLength(body)), 'list headers: content-length');
			assert.equal(resp.data.headers['transfer-encoding'], undefined, 'list headers: not chunked');
			checks++;
		}

		// The same, with headers as a plain object.
		{
			const resp = await loadAjaxPromise({
				method: 'POST',
				url: `${base}/echo`,
				headers: { 'Content-Type': 'application/json', 'X-Arijs': 'object' },
				body,
				typeExpect: ajaxTypeJson,
			});
			assert.equal(resp.data.method, 'POST', 'object headers: method');
			assert.equal(resp.data.headers['content-type'], 'application/json', 'object headers: content-type');
			assert.equal(resp.data.headers['x-arijs'], 'object', 'object headers: custom header');
			assert.equal(resp.data.body, body, 'object headers: body');
			checks++;
		}

		// The old call shape, `req` as a string, still issues a GET.
		{
			const resp = await loadAjaxPromise({ req: `${base}/echo?legacy=1` });
			assert.ok(!resp.error, 'legacy req: no error');
			assert.equal(typeof resp.data, 'string', 'legacy req: unparsed without typeExpect');
			const echo = JSON.parse(resp.data);
			assert.equal(echo.method, 'GET', 'legacy req: method');
			assert.equal(echo.url, '/echo?legacy=1', 'legacy req: path');
			checks++;
		}

		// `req` as an options object: its own method and headers win over the
		// top-level ones, and `apiProtocol` forces the module.
		{
			const resp = await loadAjaxPromise({
				req: {
					hostname: '127.0.0.1',
					port,
					path: '/echo',
					method: 'PUT',
					headers: { 'X-Arijs': 'req' },
				},
				method: 'POST',
				headers: [{ name: 'X-Arijs', value: 'opt' }],
				apiProtocol: http,
				typeExpect: ajaxTypeJson,
			});
			assert.equal(resp.data.method, 'PUT', 'req object: its method wins');
			assert.equal(resp.data.headers['x-arijs'], 'req', 'req object: its headers win');
			checks++;
		}

		// `req` as an options object without method/headers takes the top-level
		// ones, and its `protocol` picks http.
		{
			const resp = await loadAjaxPromise({
				req: { protocol: 'http:', hostname: '127.0.0.1', port, path: '/echo' },
				method: 'POST',
				headers: { 'X-Arijs': 'merged' },
				body,
				typeExpect: ajaxTypeJson,
			});
			assert.equal(resp.data.method, 'POST', 'req object: top-level method');
			assert.equal(resp.data.headers['x-arijs'], 'merged', 'req object: top-level headers');
			assert.equal(resp.data.body, body, 'req object: body');
			checks++;
		}

		// JSON responses come back parsed.
		{
			const resp = await loadAjaxPromise({ url: `${base}/json`, typeExpect: ajaxTypeJson });
			assert.equal(typeof resp.data, 'object', 'json: parsed');
			assert.equal(resp.data.url, '/json', 'json: content');
			assert.equal(resp.errorType, null, 'json: no type error');
			assert.equal(resp.errorParse, null, 'json: no parse error');
			checks++;
		}

		// A 500 fills errorServer and rejects with resp.
		await assert.rejects(
			loadAjaxPromise({ url: `${base}/fail`, typeExpect: ajaxTypeJson }),
			(resp) => {
				assert.ok(resp.errorServer instanceof AjaxError, '500: AjaxError');
				assert.equal(resp.errorServer.type, AjaxError.ERROR_SERVER, '500: type');
				assert.equal(resp.errorServer.message, 'HTTP Error 500 Internal Server Error', '500: message');
				assert.deepEqual(resp.errorServer.error, { status: 500, text: 'Internal Server Error' }, '500: error');
				assert.equal(resp.error, resp.errorServer, '500: resp.error');
				assert.equal(resp.data, 'boom', '500: body kept');
				return true;
			},
		);
		checks++;

		// Regression: parseResponse picked resp.error before parsing types and
		// running validate(), so a failing validate() resolved the promise.
		await assert.rejects(
			loadAjaxPromise({
				url: `${base}/echo`,
				typeExpect: ajaxTypeJson,
				validate: (resp) => resp.data.method === 'GET' && { message: 'GET refused' },
			}),
			(resp) => {
				assert.ok(resp.errorApp instanceof AjaxError, 'validate: AjaxError');
				assert.equal(resp.errorApp.type, AjaxError.ERROR_APP, 'validate: type');
				assert.equal(resp.errorApp.message, 'GET refused', 'validate: message');
				assert.equal(resp.error, resp.errorApp, 'validate: resp.error');
				return true;
			},
		);
		checks++;

		// Same regression: a wrong Content-Type rejects with errorType.
		await assert.rejects(
			loadAjaxPromise({ url: `${base}/text`, typeExpect: ajaxTypeJson }),
			(resp) => {
				assert.equal(resp.errorType.type, AjaxError.ERROR_TYPE, 'wrong type: type');
				assert.deepEqual(resp.errorType.error, { type: 'text/plain', expected: 'application/json' }, 'wrong type: error');
				assert.equal(resp.error, resp.errorType, 'wrong type: resp.error');
				return true;
			},
		);
		checks++;

		// Same regression: an unparsable body rejects with errorParse.
		await assert.rejects(
			loadAjaxPromise({ url: `${base}/badjson`, typeExpect: ajaxTypeJson }),
			(resp) => {
				assert.equal(resp.errorParse.type, AjaxError.ERROR_PARSE, 'bad json: type');
				assert.equal(resp.error, resp.errorParse, 'bad json: resp.error');
				return true;
			},
		);
		checks++;

		// A timeout after the headers arrived, but before the body ended, is a
		// timeout: the half-received response is not type-checked, which would
		// otherwise report errorType instead.
		{
			let settled;
			const done = new Promise((resolve) => { settled = resolve; });
			let calls = 0;
			await assert.rejects(
				new Promise((resolve, reject) => {
					mod.loadAjax({
						url: `${base}/slow`,
						typeExpect: ajaxTypeJson,
						timeout: 50,
						cb: (resp) => {
							calls++;
							if (calls === 1) {
								if (resp.error) reject(resp); else resolve(resp);
							} else {
								settled(resp);
							}
						},
					});
				}),
				(resp) => {
					assert.ok(resp.res, 'slow: headers had arrived');
					assert.equal(resp.errorType, null, 'slow: no type check while loading');
					assert.equal(resp.errorTimeout.type, AjaxError.ERROR_TIMEOUT, 'slow: timeout');
					assert.equal(resp.error, resp.errorTimeout, 'slow: resp.error');
					return true;
				},
			);
			// Let the response finish, so it does not outlive the server.
			server.release();
			await done;
			checks++;
		}

		// Regression: asBuffer used to throw from Buffer.concat(data, chunk).
		{
			const resp = await loadAjaxPromise({
				method: 'POST',
				url: `${base}/echo`,
				body,
				asBuffer: true,
			});
			assert.ok(Buffer.isBuffer(resp.data), 'asBuffer: Buffer');
			assert.equal(JSON.parse(resp.data.toString('utf8')).body, body, 'asBuffer: content');
			checks++;
		}

		// Regression: a settled request used to leave its timeout armed, which
		// kept the process alive until it fired.
		{
			const TIMEOUT = 54321;
			const realSet = globalThis.setTimeout;
			const realClear = globalThis.clearTimeout;
			const armed = [];
			const cleared = [];
			globalThis.setTimeout = function (fn, ms, ...args) {
				const handle = realSet(fn, ms, ...args);
				if (ms === TIMEOUT) armed.push(handle);
				return handle;
			};
			globalThis.clearTimeout = function (handle) {
				cleared.push(handle);
				return realClear(handle);
			};
			try {
				const resp = await loadAjaxPromise({ url: `${base}/echo`, timeout: TIMEOUT });
				assert.ok(!resp.error, 'timeout: no error');
			} finally {
				globalThis.setTimeout = realSet;
				globalThis.clearTimeout = realClear;
			}
			assert.equal(armed.length, 1, 'timeout: armed once');
			assert.ok(cleared.includes(armed[0]), 'timeout: cleared after the response');
			checks++;
		}
	} finally {
		// Drop every connection too, so a failed check cannot leave the /slow
		// response open and hang the run.
		server.close();
		server.closeAllConnections();
	}

	console.log(`ajax-net (${label}): OK (${checks} checks)`);
}
