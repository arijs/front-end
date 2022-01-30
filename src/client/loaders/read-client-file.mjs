
export function readClientFileDataURL(f) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => resolve(e.target?.result)
		reader.onerror = reject
		reader.readAsDataURL(f)
	})
}

export function readClientFileArrayBuffer(f) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => resolve(e.target?.result)
		reader.onerror = reject
		reader.readAsArrayBuffer(f)
	})
}
