
var hop = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

export function extendCustom(method, sourceProps, target) {
	if (!(method instanceof Function)) {
		method = propertyOverwrite;
	}
	var argc = arguments.length;
	if (sourceProps && argc === 3) {
		arguments[3] = sourceProps;
		argc = 4;
	}
	for (var i = 3; i < argc; i++) {
		var source = arguments[i];
		var props = sourceProps || source;
		for (var k in props) {
			if (hop.call(source, k)) {
				method(k, target, source);
			} else if (sourceProps) {
				method(k, target, sourceProps);
			}
		}
	}
	return target;
}

export function fnExtendCustom(method, sourceProps) {
	return function extend() {
		var args = slice.call(arguments);
		args.unshift(method, sourceProps);
		return extendCustom.apply(this, args);
	}
}

export function fnOptionsCustom(method) {
	return function extend() {
		var args = slice.call(arguments);
		args.unshift(method);
		return extendCustom.apply(this, args);
	}
}

export function fnPropertyExtend(subExtend) {
	propertyExtend.setSubExtend = setSubExtend;
	return propertyExtend;
	function setSubExtend(se) { subExtend = se; }
	function propertyExtend(key, target, source) {
		var sk = source[key];
		var tk = target[key];
		var so = sk && 'object' === typeof sk;
		var to = tk && 'object' === typeof tk;
		var spo = so ? Object.getPrototypeOf(sk) === Object.prototype : false;
		var tpo = to ? Object.getPrototypeOf(tk) === Object.prototype : false;
		if (spo && tpo) {
			subExtend(key, target, source, propertyExtend);
		} else {
			target[key] = sk;
		}
	}
}

export function propertyOverwrite(key, target, source) {
	target[key] = source[key];
}
export function propertyNewOnly(key, target, source) {
	if (!hop.call(target, key)) {
		target[key] = source[key];
	}
}
export function propertyNewError(key, target, source) {
	if (hop.call(target, key)) {
		throw new Error('Object already contains property '+key+': '+String(target[key]).substr(0, 32));
	}
	target[key] = source[key];
}
export function propertyHopOnly(key, target, source) {
	if (hop.call(target, key)) {
		target[key] = source[key];
	}
}
export var propertyObjectModify = fnPropertyExtend(function(key, target, source, propertyObjectModify) {
	target[key] = extendCustom(propertyObjectModify, null, target[key], source[key]);
});
export var propertyObjectCreate = fnPropertyExtend(function(key, target, source, propertyObjectCreate) {
	target[key] = extendCustom(propertyObjectCreate, null, {}, target[key], source[key]);
});

export var extend = fnExtendCustom(propertyOverwrite);
export var extendNewOnly = fnExtendCustom(propertyNewOnly);
export var extendNewError = fnExtendCustom(propertyNewError);
export var extendHopOnly = fnExtendCustom(propertyHopOnly);
export var extendDeep = fnExtendCustom(propertyObjectModify);
export var extendMerge = fnExtendCustom(propertyObjectCreate);

export var options = fnOptionsCustom(propertyOverwrite);

export default extend;
