
export function abortable(fn) {
	let abortValue = false
	return { abort, run }
	function abort(v = true) {
		abortValue = v
	}
	function run() {
		if (!abortValue) fn.apply(this, arguments)
	}
}

export function onlyRunLast() {
	let ab = undefined
	return function replace(fn) {
		ab?.abort()
		ab = abortable(fn)
		return ab.run
	}
}
