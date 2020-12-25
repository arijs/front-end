
export function contextKeysValues(ctx) {
	var keys = [];
	var values = [];
	var hop = Object.prototype.hasOwnProperty;
	for (var k in ctx) if (hop.call(ctx, k)) {
		keys.push(k);
		values.push(ctx[k]);
	}
	return { keys, values };
}

export function getValuesFromKeys(keys, ctx) {
	var values = [];
	for (var k of keys) {
		values.push(ctx[k]);
	}
	return values;
}

export function scriptToFunction(script, args) {
	return Function.apply(undefined, args.concat(script));
}

export function evalKeysValues(script, keys, values) {
	script = scriptToFunction(script, keys);
	return { run, runWith };
	function run() {
		return script.apply(this, values);
	}
	function runWith(ctx) {
		return script.apply(this, getValuesFromKeys(keys, ctx));
	}
}

export function evalContext(script, ctx) {
	const {keys, values} = contextKeysValues(ctx);
	return evalKeysValues(script, keys, values);
}

export default evalContext;
