import { arrayFrom } from '../utils/collection';

export function AjaxError(message, resp, error, type) {
	this.message = message;
	this.resp = resp;
	this.error = error;
	this.type = type;
	this.stack = (new Error()).stack;
}
AjaxError.prototype = new Error;
AjaxError.prototype.name = 'AjaxError';
AjaxError.ERROR_APP = 'app';
AjaxError.ERROR_NET = 'net';
AjaxError.ERROR_SERVER = 'server';
AjaxError.ERROR_TYPE = 'type';
AjaxError.ERROR_PARSE = 'parse';
AjaxError.ERROR_TIMEOUT = 'timeout';

export const formatError = {
	app(error) {
		return {
			message: error.title || error.message,
			error
		};
	},
	net() {
		return {
			message: 'Network error: Your connection or the server is down'
		};
	},
	server(status, text) {
		return {
			message: 'HTTP Error '+status+(text?' '+text:''),
			error: { status, text }
		}
	},
	type(type, expected) {
		var message = 'Unexpected type '+JSON.stringify(type);
		if (expected) {
			message += ', expected '+JSON.stringify(expected);
		}
		return {
			message,
			error: { type, expected }
		};
	},
	parse(type, error) {
		return {
			message: 'Error parsing '+JSON.stringify(type),
			error
		};
	},
	timeout(time) {
		return {
			message: 'Load timeout '+Number(time/1000).toFixed(1)+'s',
			error: { time }
		};
	}
};

export function respGetType(resp) {
	return resp.req.getResponseHeader("Content-Type");
}

export function respErrorType(resp, expected) {
	var {message, error} = resp.formatError.type(respGetType(resp), expected, resp);
	resp.errorType = new AjaxError(message, resp, error, AjaxError.ERROR_TYPE);
}

export function createTypeParser(opt) {
	const type = {
		opt,
		name: opt.name,
		respIsType(resp) {
			return opt.isType(respGetType(resp), resp);
		},
		respParseCheckType(resp) {
			if (type.respIsType(resp)) {
				type.respParse(resp);
			} else {
				respErrorType(resp, type.name);
			}
		},
		respParse(resp) {
			try {
				opt.parse(resp);
			} catch (e) {
				var {message, error} = resp.formatError.parse(type.name, e, resp);
				// var tl = loadAjaxMessages['error-parse'];
				// var tlVars = {
				// 	error: e.message
				// };
				// {message: printf(tl.message, tlVars)}
				resp.errorParse = new AjaxError(message, resp, error, AjaxError.ERROR_PARSE);
			}
		}
	};
	return type;
}

export const ajaxTypeJson = createTypeParser({
	name: 'application/json',
	isType(type) {
		return /\bapplication\/(json|javascript)\b/i.test(type);
	},
	parse(resp) {
		return resp.data = JSON.parse(resp.data);
	}
});

export function respTestTypes(resp, types) {
	for (var i = 0, c = types.length; i < c; i++) {
		if (type.respIsType(resp)) return type;
	}
}

export function parseOptTypes(resp) {
	var typeExpect = arrayFrom(resp.opt.typeExpect);
	var typeAllow = arrayFrom(resp.opt.typeAllow);
	var foundExpect = respTestTypes(resp, typeExpect);
	var foundAllow = respTestTypes(resp, typeAllow);
	if (foundExpect) foundExpect.respParse(resp);
	else {
		if (foundAllow) foundAllow.respParse(resp);
		if (typeExpect[0]) typeExpect[0].respParseCheckType(resp);
	}
}

export function parseValidate(resp) {
	var validate = resp.opt.validate;
	if (validate instanceof Function) {
		var err = validate(resp);
		if (err) {
			// var tl = loadAjaxMessages['error-validate'];
			// if (!err.title) err.title = tl.title;
			// if (!err.message) err.message = tl.message;
			var {message, error} = resp.formatError.app(err, resp);
			resp.errorApp = new AjaxError(message, resp, error, AjaxError.ERROR_APP);
		}
	}
}

export function parseGetError(resp) {
	resp.error = resp.errorApp
		|| resp.errorNet
		|| resp.errorServer
		|| resp.errorType
		|| resp.errorParse
		|| resp.errorTimeout;
}

export function parseResponse(resp) {
	parseOptTypes(resp);
	parseValidate(resp);
	parseGetError(resp);
	return resp.opt.cb(resp);
}

export default function loadAjax(opt) {
	var req = new XMLHttpRequest;
	var head = opt.headers;
	var hc = head && head.length || 0;
	var parse = opt.parse || parseResponse;
	var timeout = opt.timeout;
	var idTimeout;
	var stopTimeout = function stopTimeout() {
		if (idTimeout) {
			clearTimeout(idTimeout);
			idTimeout = void 0;
			resp.errorTimeout = null;
		}
	};
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
	if (timeout != null && !isNaN(timeout) && timeout > 0) {
		idTimeout = setTimeout(function () {
			if (!resp.loading) return;
			var {message, error} = resp.formatError.timeout(timeout, resp);
			resp.errorTimeout = new AjaxError(message, resp, error, AjaxError.ERROR_TIMEOUT);
			parse(resp);
		}, timeout);
	}
	req.addEventListener('load', function() {
		// var tl = loadAjaxMessages['error-server'];
		resp.loading = false;
		resp.data = req.responseText;
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
	req.open(opt.method || 'GET', opt.url);
	for (var i = 0; i < hc; i++) {
		var h = head[i];
		h && h.name && req.setRequestHeader(h.name, h.value);
	}
	req.send(opt.body);
	return resp;
};
