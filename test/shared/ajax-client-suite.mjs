// Assertion suite for client/loaders/ajax, driven by a minimal fake
// XMLHttpRequest so it runs in Node. Receives the module under test, so the
// ESM half runs it on src/ and the CommonJS half on lib/.
import assert from 'node:assert/strict';

// Each test sets `FakeXHR.respond(xhr)`, which returns what the "server"
// answers: { status, statusText, contentType, body }, { netError: true }, or
// null to never answer.
class FakeXHR {
	constructor() {
		this.listeners = {};
		this.headers = [];
		this.upload = { addEventListener() {} };
		FakeXHR.last = this;
	}
	addEventListener(type, fn) {
		(this.listeners[type] ||= []).push(fn);
	}
	emit(type, ev) {
		for (const fn of this.listeners[type] || []) fn.call(this, ev);
	}
	open(method, url) {
		this.method = method;
		this.url = url;
	}
	setRequestHeader(name, value) {
		this.headers.push([name, value]);
	}
	getResponseHeader(name) {
		return /^content-type$/i.test(name) ? this.contentType ?? null : null;
	}
	send(body) {
		this.body = body;
		const answer = FakeXHR.respond(this);
		if (!answer) return;
		setImmediate(() => {
			if (answer.netError) {
				this.emit('error', { type: 'error' });
				return;
			}
			this.status = answer.status;
			this.statusText = answer.statusText || '';
			this.contentType = answer.contentType;
			this.responseText = this.response = answer.body;
			this.emit('load', { type: 'load' });
		});
	}
}

export async function runAjaxClientSuite(mod, label) {
	const { loadAjaxPromise, ajaxTypeJson, AjaxError } = mod;
	const previous = globalThis.XMLHttpRequest;
	globalThis.XMLHttpRequest = FakeXHR;
	let checks = 0;

	try {
		// POST with headers as a { name, value } list, empty items skipped.
		{
			FakeXHR.respond = (xhr) => ({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ method: xhr.method, url: xhr.url, body: xhr.body }),
			});
			const resp = await loadAjaxPromise({
				method: 'POST',
				url: '/api/echo',
				headers: [
					{ name: 'Content-Type', value: 'application/json' },
					null,
					{ name: '', value: 'skipped' },
					{ name: 'X-Arijs', value: 'list' },
				],
				body: '{"a":1}',
				typeExpect: ajaxTypeJson,
			});
			assert.ok(!resp.error, 'post: no error');
			assert.deepEqual(resp.data, { method: 'POST', url: '/api/echo', body: '{"a":1}' }, 'post: parsed echo');
			assert.deepEqual(FakeXHR.last.headers, [
				['Content-Type', 'application/json'],
				['X-Arijs', 'list'],
			], 'post: headers set, empty ones skipped');
			checks++;
		}

		// A 500 fills errorServer and rejects with resp.
		FakeXHR.respond = () => ({ status: 500, statusText: 'Internal Server Error', contentType: 'text/plain', body: 'boom' });
		await assert.rejects(loadAjaxPromise({ url: '/fail' }), (resp) => {
			assert.ok(resp.errorServer instanceof AjaxError, '500: AjaxError');
			assert.equal(resp.errorServer.type, AjaxError.ERROR_SERVER, '500: type');
			assert.equal(resp.errorServer.message, 'HTTP Error 500 Internal Server Error', '500: message');
			assert.equal(resp.error, resp.errorServer, '500: resp.error');
			return true;
		});
		checks++;

		// A failing validate() fills errorApp, through a custom formatError.
		FakeXHR.respond = () => ({ status: 200, contentType: 'application/json', body: '{"ok":false}' });
		await assert.rejects(loadAjaxPromise({
			url: '/validate',
			typeExpect: ajaxTypeJson,
			validate: (resp) => !resp.data.ok && { message: 'not ok' },
			formatError: { ...mod.formatError, app: (error) => ({ message: `app: ${error.message}`, error }) },
		}), (resp) => {
			assert.equal(resp.errorApp.type, AjaxError.ERROR_APP, 'validate: type');
			assert.equal(resp.errorApp.message, 'app: not ok', 'validate: custom formatError');
			assert.equal(resp.error, resp.errorApp, 'validate: resp.error');
			return true;
		});
		checks++;

		// A wrong Content-Type fills errorType.
		FakeXHR.respond = () => ({ status: 200, contentType: 'text/html', body: '<p>' });
		await assert.rejects(loadAjaxPromise({ url: '/html', typeExpect: ajaxTypeJson }), (resp) => {
			assert.equal(resp.errorType.type, AjaxError.ERROR_TYPE, 'type: type');
			assert.deepEqual(resp.errorType.error, { type: 'text/html', expected: 'application/json' }, 'type: error');
			return true;
		});
		checks++;

		// A network error fills errorNet.
		FakeXHR.respond = () => ({ netError: true });
		await assert.rejects(loadAjaxPromise({ url: '/down' }), (resp) => {
			assert.equal(resp.errorNet.type, AjaxError.ERROR_NET, 'net: type');
			assert.equal(resp.error, resp.errorNet, 'net: resp.error');
			return true;
		});
		checks++;

		// No answer within opt.timeout fills errorTimeout.
		FakeXHR.respond = () => null;
		await assert.rejects(loadAjaxPromise({ url: '/slow', timeout: 20 }), (resp) => {
			assert.equal(resp.errorTimeout.type, AjaxError.ERROR_TIMEOUT, 'timeout: type');
			assert.equal(resp.errorTimeout.message, 'Load timeout 0.0s', 'timeout: message');
			assert.equal(resp.error, resp.errorTimeout, 'timeout: resp.error');
			return true;
		});
		checks++;
	} finally {
		globalThis.XMLHttpRequest = previous;
	}

	console.log(`ajax client (${label}): OK (${checks} checks)`);
}
