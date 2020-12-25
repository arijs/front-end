
/**
 * @param t
 * Current time, starting at zero.
 * @param b
 * Starting value to ease.
 * @param c
 * Ending value.
 * @param d
 * Duration in time.
 */
export function inter (t, b, c, d, fn) {
	return fn(t / d) * (c - b) + b;
}
export function interMod (t, b, c, d, ease, mod) {
	return mod(t / d, ease) * (c - b) + b;
}

export function linear (x) {
	return x;
}
export function sin (x) {
	return 1 - Math.sin((1 - x) * 0.5 * Math.PI);
}
export function quad (x) {
	return x * x;
}
export function cubic (x) {
	return x * x * x;
}
export function quart (x) {
	return x * x * x * x;
}
export function quint (x) {
	return x * x * x * x * x;
}

export function modIn (t, fn) {
	return fn(t);
}
export function modOut (t, fn) {
	return 1 - fn(1 - t);
}
export function modTwice (t, fn) {
	return fn(t * 2) * 0.5;
}
export function modInOut (t, fn) {
	return (t < 0.5 ?
		modTwice(t, fn) :
		modOut(t, fnMod(fn, modTwice))
	);
}
export function modInOut2 (t, fn) {
	return (t < 0.5 ?
		modTwice(t, fn[0]) :
		modOut(t, fnMod(fn[1], modTwice))
	);
}
export function modOutIn (t, fn) {
	return (t < 0.5 ?
		modTwice(t, fnMod(fn, modOut)) :
		modTwice(t - 0.5, fn) + 0.5
	);
}
export function modOutIn2 (t, fn) {
	return (t < 0.5 ?
		modTwice(t, fnMod(fn[0], modOut)) :
		modTwice(t - 0.5, fn[1]) + 0.5
	);
}

export function fnMod (fn, mod) {
	return function(t) {
		return mod(t, fn);
	};
}
export function fnInter (fn) {
	return function(t, b, c, d) {
		return inter(t, b, c, d, fn);
	};
}
