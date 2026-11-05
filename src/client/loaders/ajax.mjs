import extend from '../../isomorphic/utils/extend.mjs';
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

export function respGetType(resp) {
	return resp.req.getResponseHeader("Content-Type");
}

export const {
	respErrorType,
	createTypeParser,
	ajaxTypeJson,
} = createAjaxTypes(respGetType);

export function createResponseTypeParser({type, getData} = {}) {
	return {
		beforeReq(req) {
			if ('string' === typeof type) {
				req.responseType = type
			}
		},
		getData(req) {
			if (getData instanceof Function) {
				return getData(req)
			} else switch (type) {
				case '':
				case 'text':
					return req.responseText
				case 'arraybuffer':
				case 'blob':
				case 'document':
				case 'json':
				default:
					return req.response
			}
		}
	}
}

export const responseTextParser = createResponseTypeParser({ type: 'text' })
export const responseArrayBufferParser = createResponseTypeParser({ type: 'arraybuffer' })
export const responseBlobParser = createResponseTypeParser({ type: 'blob' })
export const responseDocumentParser = createResponseTypeParser({ type: 'document' })
export const responseJsonParser = createResponseTypeParser({ type: 'json' })

export function parseResponse(resp) {
	if (!resp.loading) {
		parseOptTypes(resp);
	}
	parseValidate(resp);
	parseGetError(resp);
	return resp.opt.cb(resp);
}

export function loadAjax(opt) {
	var req = new XMLHttpRequest;
	var head = opt.headers;
	var hc = head && head.length || 0;
	var parse = opt.parse || parseResponse;
	var parseResponseData = opt.parseResponse || responseTextParser;
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
		req: req,
		opt: opt,
		formatError: opt.formatError || formatError
	};
	var stopTimeout = startTimeout(resp, opt.timeout, parse);
	req.addEventListener('load', function() {
		// var tl = loadAjaxMessages['error-server'];
		resp.loading = false;
		resp.data = parseResponseData.getData(req);
		if (req.status < 200 || req.status >= 300) {
			// var tlVars = {
			// 	code: req.status,
			// 	statusText: req.statusText
			// };
			// resp.errorServer = new AjaxError(
			// 	printf(tl.title, tlVars),
			// 	resp,
			// 	{ message: printf(tl.message, tlVars) }
			// );
			var {message, error} = resp.formatError.server(req.status, req.statusText, resp);
			resp.errorServer = new AjaxError(message, resp, error, AjaxError.ERROR_SERVER);
		}
		stopTimeout();
		parse(resp);
	});
	req.addEventListener('error', function(ev) {
		// var tl = loadAjaxMessages['error-net'];
		resp.loading = false;
		var {message, error} = resp.formatError.net(ev, resp);
		resp.errorNet = new AjaxError(message, resp, error, AjaxError.ERROR_NET);
		stopTimeout();
		parse(resp);
	});
	if (opt.onProgress instanceof Function) {
		req.addEventListener('progress', opt.onProgress);
	}
	if (opt.onProgressUpload instanceof Function) {
		req.upload.addEventListener('progress', opt.onProgressUpload);
	}
	req.open(opt.method || 'GET', opt.url);
	parseResponseData.beforeReq(req);
	if (opt.xhrFields) extend(req, opt.xhrFields);
	for (var i = 0; i < hc; i++) {
		var h = head[i];
		h && h.name && req.setRequestHeader(h.name, h.value);
	}
	req.send(opt.body);
	return resp;
};

export const loadAjaxPromise = createLoadAjaxPromise(loadAjax);

export default loadAjax;
