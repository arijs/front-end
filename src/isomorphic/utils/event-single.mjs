
function eventSingle(name) {
	const listeners = []
	return { on, off, fire }
	function on(fn) {
		if (!(fn instanceof Function)) {
			throw new Error(`eventSingle${name ? `(${name})` : ''}: listener is not a function ${JSON.stringify(fn)}`)
		}
		listeners.push(fn)
	}
	function off(fn) {
		if (fn) {
			const index = listeners.indexOf(fn)
			if (-1 !== index) listeners.splice(index, 1)
		} else {
			listeners.splice(0, listeners.length)
		}
	}
	function fire() {
		for (const f of listeners) f.apply(this, arguments)
	}
}

export default eventSingle
