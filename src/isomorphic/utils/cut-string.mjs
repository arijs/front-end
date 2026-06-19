
export function cutFromEnd(str, cutLen, pad) {
	const slices = []
	let slen = str.length
	while (slen > 0) {
		const startTheoric = slen - cutLen
		const start = Math.max(0, startTheoric)
		const sliceLen = cutLen + (startTheoric - start)
		const slice = str.substring(start, start + sliceLen)
		const slicePad = sliceLen === cutLen || !pad ? slice :
			pad instanceof Function ? pad(slice, cutLen) :
			String(slice).padStart(cutLen, String(pad))
		slices.unshift(slicePad)
		str = str.substring(0, start)
		slen -= sliceLen
	}
	return slices
}

export function numListSumTwo(c1, numBase) {
	const reduceTwoMap = { lc: 0, ls: 0, rc: 0, rs: 0 }
	// const c1 = cutFromEnd(val, 4, '0')
	const s1 = c1.map((n) => parseInt(n, numBase)).reduce((p, n) => (
		p.lc > p.rc ? (p.rs += n, p.rc++) : (p.ls += n, p.lc++), p
	), reduceTwoMap)
	return s1
}
