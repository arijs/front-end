
function datePart(d) {
	const e = new Date(d)
	return new Date(
		e.getFullYear(),
		e.getMonth(),
		e.getDate(),
	)
}

export default datePart
