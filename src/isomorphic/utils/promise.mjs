
export function promiseTimeout(time, result) {
	return new Promise(resolve => setTimeout(resolve, time, result))
}

// ignores any rejects except if all promises rejects
export function promiseRaceFirst (promiseList) {
	return new Promise((resolve, reject) => {
		const order = []
		const errors = []
		let first
		promiseList.forEach((promise, i) => {
			promise.then(
				data => {
					if (undefined === first) {
						first = data || null
						resolve(data)
					}
				},
				(err) => {
					errors.push(err)
					order.push(i)
					if(errors.length == promiseList.length) {
						reject({errors, order});
					}
				}
			)
		})
	})
}
