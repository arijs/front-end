// Code shared by the browser loader (client/loaders/ajax) and the Node loader
// (server/loaders/ajax-net). Both modules re-export these, so the universal
// entry gets one AjaxError, one formatError and the same response pipeline on
// either side. Only reading the response Content-Type differs between the two,
// which is why the type parsers come from a factory.
import { arrayFrom } from '../utils/collection.mjs';

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

/**
 * Builds the Content-Type dependent helpers around `respGetType(resp)`, the
 * one piece each environment reads differently.
 */
export function createAjaxTypes(respGetType) {
	function respErrorType(resp, expected) {
		var {message, error} = resp.formatError.type(respGetType(resp), expected, resp);
		resp.errorType = new AjaxError(message, resp, error, AjaxError.ERROR_TYPE);
	}

	function createTypeParser(opt) {
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

	const ajaxTypeJson = createTypeParser({
		name: 'application/json',
		isType(type) {
			return /\bapplication\/(json|javascript)\b/i.test(type);
		},
		parse(resp) {
			return resp.data = JSON.parse(resp.data);
		}
	});

	return { respErrorType, createTypeParser, ajaxTypeJson };
}

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

/**
 * Arms `opt.timeout` for a request. Returns the function that disarms it once
 * the request settles.
 */
export function startTimeout(resp, timeout, parse) {
	var idTimeout;
	if (timeout != null && !isNaN(timeout) && timeout > 0) {
		idTimeout = setTimeout(function () {
			if (!resp.loading) return;
			var {message, error} = resp.formatError.timeout(timeout, resp);
			resp.errorTimeout = new AjaxError(message, resp, error, AjaxError.ERROR_TIMEOUT);
			parse(resp);
		}, timeout);
	}
	return function stopTimeout() {
		if (idTimeout) {
			clearTimeout(idTimeout);
			idTimeout = void 0;
			resp.errorTimeout = null;
		}
	};
}

/**
 * Wraps a callback-style `loadAjax(opt)` into a promise that resolves with
 * `resp`, or rejects with it when `resp.error` is set.
 */
export function createLoadAjaxPromise(loadAjax) {
	return function loadAjaxPromise(opt) {
		return new Promise((resolve, reject) => {
			opt.cb = resp => resp.error ? reject(resp) : resolve(resp);
			return loadAjax(opt);
		});
	};
}
