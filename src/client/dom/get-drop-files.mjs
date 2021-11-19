
function getDropEventFiles(ev, max = Infinity) {
	const list = []
	let addedCount = 0
	const dt = ev.dataTransfer
	const itemList = dt?.items
	const fileList = dt?.files
	if (itemList) {
		const count = itemList.length
		for (let i = 0; i < count; i++) {
			const item = itemList[i]
			if (item.kind !== 'file') continue
			if (addedCount == max) break
			list.push(item.getAsFile())
			addedCount++
		}
	} else if (fileList) {
		const count = fileList.length
		for (let i = 0; i < count; i++) {
			const item = fileList[i]
			if (addedCount == max) break
			list.push(item)
			addedCount++
		}
	}
	return list
}

export default getDropEventFiles
