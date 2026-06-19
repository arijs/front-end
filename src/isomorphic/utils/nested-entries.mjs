
export function stringSplitDots(str) {
	return str.split('.')
}

export function objectFromNestedEntries(
	entries,
	startPath = [],
	result = undefined,
	splitKeys = stringSplitDots,
) {
	const ensureResultObject = (key) => {
		if (undefined === result) {
			result = {}
		} else if (
			'object' !== typeof result ||
			![Object.prototype, null, undefined].includes(Object.getPrototypeOf(result))
		) {
			console.error(`objectFromNestedEntries() conflicting key`, { key, startPath, result })
			throw new Error(`objectFromNestedEntries() invalid result type for key=${JSON.stringify(key)}`)
		}
	}
	for (const [keyStr, value] of entries) {
		const key = splitKeys(keyStr)
		if (startPath.every((k, i) => k === key[i])) {
			const endPath = key.slice(startPath.length)
			if (0 === endPath.length) {
				if (undefined === result) {
					result = value
				} else {
					console.error(`objectFromNestedEntries() conflicting key`, { key, startPath, result })
					throw new Error(`objectFromNestedEntries() invalid empty endPath for key=${JSON.stringify(key)}`)
				}
			} else if (1 === endPath.length) {
				ensureResultObject(key)
				result[endPath[0]] = value
			} else if (endPath.length > 1) {
				ensureResultObject(key)
				result[endPath[0]] = objectFromNestedEntries(
					entries,
					startPath.concat([endPath[0]]),
					result[endPath[0]],
					splitKeys,
				)
			}
		}
	}
	return result
}

export default objectFromNestedEntries
