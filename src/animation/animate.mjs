import { linear, modIn, interMod } from './easing';

export function polyfillAnimationFrame (callback) {
	window.setTimeout(callback, 40); // 1000 / 25
}

export default function animate (from, to, time, ease, mod, cb) {
	var raf = window.requestAnimationFrame || polyfillAnimationFrame;
	ease || (ease = linear);
	mod || (mod = modIn);
	var start = (new Date()).getTime();
	var timer = function() {
		var pos = new Date().getTime() - start;
		var posMin = Math.min(time, pos);
		var eased = interMod(posMin, from, to, time, ease, mod);
		if (cb(eased, pos)) return;
		if (posMin !== time) raf(timer);
	};
	raf(timer);
};
