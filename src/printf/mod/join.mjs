
export function printfJoin(value, params) {
	value = value instanceof Array
		? value : (value ? [value] : []);
	return value.join(params && params.glue || '');
}
