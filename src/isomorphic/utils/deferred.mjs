import { callListeners } from './listeners.mjs';

export function deferred(ref) {
	var listeners = [];
	var ctx, args;
	var obj = {
		ref: ref,
		then: then,
		done: done,
		nevermind: nevermind,
		clear: clear
	};
	return obj;
	function then(fn) {
		if (args) {
			fn.apply(ctx, args);
		} else {
			listeners.push(fn);
		}
		return obj;
	}
	function done() {
		ctx = this;
		args = arguments;
		callListeners(listeners, args, ctx);
		listeners = null;
		return obj;
	}
	function nevermind(fn) {
		var i = 0, c = listeners.length;
		for (;i<c;i++) {
			if (listeners[i] === fn) {
				listeners.splice(i, 1);
				return i;
			}
		}
		return -1;
	}
	function clear() {
		listeners = [];
		ctx = args = void 0;
		return obj;
	}
}

export function subProm(ref, sub, handler, self, args) {
	var def = deferredPromise(ref, null == sub ? 0 : 1 + sub);
	try {
		var res = handler.apply(self, args);
		if (res &&
			res.then instanceof Function &&
			res.catch instanceof Function
		) {
			res.then(def.resolve);
			res.catch(def.reject);
		} else {
			def.resolve(res);
		}
	} catch (err) {
		def.reject(err);
	}
	return def;
}

export function deferredPromise(ref, sub) {
	var ssub = null == sub ? '' : '/'+sub;
	var success = deferred(ref+ssub+'/s');
	var failure = deferred(ref+ssub+'/f');
	var promise = {
		then: function() {
			return subProm(ref, sub, success.then, this, arguments).promise;
		},
		catch: function() {
			return subProm(ref, sub, failure.then, this, arguments).promise;
		},
		unthen: success.nevermind,
		uncatch: failure.nevermind
	}
	return {
		ref: ref,
		sub: sub,
		resolve: success.done,
		reject: failure.done,
		promise: promise,
		success: success,
		failure: failure,
		clear: clear
	};
	function clear() {
		success.clear();
		failure.clear();
	}
}

export default deferred;
