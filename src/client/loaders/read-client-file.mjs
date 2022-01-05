
function readClientFile(f) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => resolve(e.target?.result)
		reader.onerror = reject
		reader.readAsDataURL(f)
	})
}

export default readClientFile
