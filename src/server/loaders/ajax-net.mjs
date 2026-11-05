import http from "http";
import https from "https";
import {
	createAjaxTypes,
	startTimeout,
	createLoadAjaxPromise,
	AjaxError,
	formatError,
	parseOptTypes,
	parseValidate,
	parseGetError,
} from '../../isomorphic/loaders/ajax-common.mjs';

export {
	AjaxError,
	formatError,
	respTestTypes,
	parseOptTypes,
	parseValidate,
	parseGetError,
} from '../../isomorphic/loaders/ajax-common.mjs';

export const httpProtocol = http;
export const httpsProtocol = https;

export function respGetType(resp) {
	return resp.res.headers["content-type"];
}

export const {
	respErrorType,
	createTypeParser,
	ajaxTypeJson,
} = createAjaxTypes(respGetType);

export function parseResponse(resp) {
	parseGetError(resp);

	if (resp.res) {
		parseOptTypes(resp);
	}

	parseValidate(resp);
	return resp.opt.cb(resp);
}

let defaultEncoding = 'utf8';

export function setDefaultEncoding(enc) {
	defaultEncoding = enc;
}

/**
 * Accepts the browser loader's list of `{ name, value }` (empty items are
 * skipped, and a repeated name is joined with ", " as XMLHttpRequest does) or
 * a plain object, and returns a plain object for `http.request`.
 */
function headersToObject(headers) {
	if (!headers) return;
	if (!(headers instanceof Array)) return Object.assign({}, headers);
	var obj = {};
	for (var i = 0, c = headers.length; i < c; i++) {
		var h = headers[i];
		if (!h || !h.name) continue;
		obj[h.name] = h.name in obj ? obj[h.name] + ', ' + h.value : h.value;
	}
	return obj;
}

function isRequestOptions(target) {
	return !target || ('object' === typeof target && !(target instanceof URL));
}

/**
 * `opt.apiProtocol` wins; otherwise `http` for an `http:` URL and `https`
 * for anything else, which keeps the old default for options objects with no
 * `protocol`.
 */
function pickProtocol(opt, target) {
	if (opt.apiProtocol) return opt.apiProtocol;
	var protocol;
	if ('string' === typeof target) {
		try {
			protocol = new URL(target).protocol;
		} catch (e) {
			// not an absolute URL: let the request itself report it
		}
	} else if (target) {
		protocol = target.protocol;
	}
	return 'http:' === protocol ? http : https;
}

/**
 * The arguments for `http.request(...)`. `opt.req` (or `opt.url`) is the
 * target; `opt.method` and `opt.headers` apply unless an options object in
 * `opt.req` sets its own.
 */
function requestArgs(opt, target) {
	var method = opt.method;
	var headers = headersToObject(opt.headers);
	if (isRequestOptions(target)) {
		var options = Object.assign({}, target);
		if (options.method == null && method) options.method = method;
		if (options.headers == null && headers) options.headers = headers;
		return [options];
	}
	var extra = {};
	if (method) extra.method = method;
	if (headers) extra.headers = headers;
	return [target, extra];
}

function canMeasure(body) {
	return 'string' === typeof body || body instanceof Uint8Array;
}

export function loadAjax(opt) {
	var parse = opt.parse || parseResponse;
	var resp = {
		loading: true,
		errorApp: null,
		errorNet: null,
		errorServer: null,
		errorType: null,
		errorParse: null,
		errorTimeout: null,
		error: null,
		data: null,
		headers: null,
		req: null,
		res: null,
		opt: opt,
		formatError: opt.formatError || formatError,
	};
	var target = opt.req ?? opt.url;
	var apiProtocol = pickProtocol(opt, target);
	var stopTimeout = startTimeout(resp, opt.timeout, parse);
	resp.req = apiProtocol.request(...requestArgs(opt, target), res => {
		let data;
		resp.res = res;
		resp.headers = res.headers;
		if (res.statusCode < 200 || res.statusCode >= 300) {
			var {message, error} = resp.formatError.server(res.statusCode, res.statusMessage, resp);
			resp.errorServer = new AjaxError(message, resp, error, AjaxError.ERROR_SERVER);
		}
		if (opt.asBuffer) {
			data = Buffer.alloc(0);
		} else {
			res.setEncoding(opt.resEncoding || defaultEncoding);
			data = '';
		}
		res.on('data', opt.onData || (chunk => {
			if (data instanceof Buffer) {
				data = Buffer.concat([data, chunk]);
			} else {
				data = data.concat(chunk);
			}
		}));
		res.on('end', opt.onEnd || (() => {
			resp.loading = false;
			resp.data = data;
			stopTimeout();
			parse(resp);
		}));
	});
	resp.req.on('error', (ev) => {
		resp.loading = false;
		var {message, error} = resp.formatError.net(ev, resp);
		resp.errorNet = new AjaxError(message, resp, error, AjaxError.ERROR_NET);
		stopTimeout();
		parse(resp);
	});
	if (opt.onOpen) {
		opt.onOpen(resp);
	} else {
		var body = opt.body;
		if (body) {
			var req = resp.req;
			// Send a Content-Length, as the browser does, rather than falling
			// back to chunked encoding, which some servers refuse.
			if (canMeasure(body) &&
				!req.hasHeader('content-length') &&
				!req.hasHeader('transfer-encoding')) {
				req.setHeader('Content-Length', Buffer.byteLength(body));
			}
			req.write(body);
		}
		resp.req.end();
	}
	return resp;
};

export default loadAjax;

export const loadAjaxPromise = createLoadAjaxPromise(loadAjax);
