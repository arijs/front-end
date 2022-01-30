
export function cutNumberArray(divs, number) {
	const list = []
	for (const count of divs) {
		const value = count ? number % count : number
		list.unshift(value)
		number = count ? ( number - value ) / count : 0
	}
	list.unshift(number)
	return list
}

export function cutNumber(divs, number) {
	const list = []
	const map = {}
	for (const unit of divs) {
		const { key, count } = unit
		const value = count ? number % count : number
		const obj = { value, unit }
		list.unshift(obj)
		map[key] = obj
		number = count ? ( number - value ) / count : 0
	}
	return { map, list }
}
