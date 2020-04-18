import { arrayFrom } from '../utils/collection';

export function printfFill(list, vars, mods, cbError) {
	list = arrayFrom(list);
	var c = list.length;
	var out = '';
	for (var i = 0; i < c; i++) {
		out += printfFillItem(list[i], vars, mods, cbError);
	}
	return out;
}

export function printfFillItem(parsed, vars, mods, cbError) {
	var key = parsed.key;
	var value = parsed.text;
	if (!(cbError instanceof Function)) {
		cbError = console.log;
	}
	if (key) {
		var mod = parsed.mod, fn;
		if (mod) {
			if (mods.has(mod)) {
				fn = mods.get(mod);
			} else {
				cbError(new Error(
					'printf: Custom formatter '+
					JSON.stringify(mod)+
					' not found in mods'
				));
			}
		}
		if (vars.has(key)) {
			value = vars.get(key);
		} else {
			cbError(new Error(
				'printf: Property '+
				JSON.stringify(key)+
				' not found in vars'
			));
			value = '';
		}
		return fn
			? fn(value, parsed.params, key, vars, mods) || ''
			: value;
	} else {
		return value;
	}
}
