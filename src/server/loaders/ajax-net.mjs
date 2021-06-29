import http from "http";
import https from "https";
import { arrayFrom } from '../../isomorphic/utils/collection.mjs';

export const httpProtocol = http;
export const httpsProtocol = https;

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
	return resp.res.headers["content-type"];
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
		var type = types[i];
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
		headers: null,
		req: null,
		res: null,
		opt: opt,
		formatError: opt.formatError || formatError,
	};
	// @TODO
	const {apiProtocol = https} = opt;
	if (timeout != null && !isNaN(timeout) && timeout > 0) {
		idTimeout = setTimeout(function () {
			if (!resp.loading) return;
			var {message, error} = resp.formatError.timeout(timeout, resp);
			resp.errorTimeout = new AjaxError(message, resp, error, AjaxError.ERROR_TIMEOUT);
			parse(resp);
		}, timeout);
	}
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

export function loadAjaxPromise(opt) {
	return new Promise((resolve, reject) => {
		opt.cb = resp => resp.error ? reject(resp) : resolve(resp);
		return loadAjax(opt);
	});
}
