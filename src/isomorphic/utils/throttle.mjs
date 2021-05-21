
export default function throttle(fn, wait = 1000) {
	let self, args;
	function fire() {
		waiting = false;
		fn.apply(self, args);
		self = args = undefined;
	}
	function trigger(..._args) {
		waiting = true;
		self = this;
		args = _args;
		if (waiting) return;
		_iv = setTimeout(fire, wait);
	}
	function cancel() {
		self = args = undefined;
		_iv && clearTimeout(_iv);
		_iv = null;
		waiting = false;
	}
	function setWait(newWait) {
		wait = newWait;
	}
	function isWaiting() {
		return waiting;
	}
	var _iv;
	var waiting = false;
	trigger.cancel = cancel;
	trigger.setWait = setWait;
	trigger.isWaiting = isWaiting;
	return trigger;
}
