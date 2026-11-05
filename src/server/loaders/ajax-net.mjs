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

function parseResponse(resp) {
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
	// @TODO
	const {apiProtocol = https} = opt;
	var stopTimeout = startTimeout(resp, opt.timeout, parse);
	resp.req = apiProtocol.request(opt.req, res => {
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
				data = Buffer.concat(data, chunk);
			} else {
				data = data.concat(chunk);
			}
		}));
		res.on('end', opt.onEnd || (() => {
			resp.loading = false;
			resp.data = data;
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
	} else{
		if (opt.body) {
			resp.req.write(opt.body);
		}
		resp.req.end();
	}
	return resp;
};

export default loadAjax;

export const loadAjaxPromise = createLoadAjaxPromise(loadAjax);
