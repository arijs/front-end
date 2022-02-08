
// inspired by:
// https://marc-b-reynolds.github.io/math/2017/10/13/XorRotate.html
// https://news.ycombinator.com/item?id=30249040

function poorMansPower(x, p) {
	let r = 1
	for (let i = 0; i < p; i++) r *= x
	return r
}

function inRange(val, min, max, errPrefix) {
	errPrefix = errPrefix || `InRange(${min}, ${max})`
	if (+val !== val) {
		throw new Error(`${errPrefix}: value is not a number (${typeof x} ${JSON.stringify(x)})`)
	}
	if (!(min <= val && val <= max)) {
		throw new Error(`${errPrefix}: value is out of range (${val})`)
	}
	return val
}

export function fnXorRotate2(bits) {
	bits = inRange(bits, 2, 32, `FnXorRotate(bits: 2...32)`)
	const maxVal = poorMansPower(2, bits)
	const rot = (x, i) => {
		inRange(x >>> 0, 0, maxVal, `XorRotate(x: 0...${maxVal})`)
		inRange(i, 0, bits-1, `XorRotate(bits: 0...${bits-1})`)
		x = ((x << i)|(x >>> (bits-i))) & (maxVal - 1)
		return x
	}
	const rot2 = (x, a, b) => x ^ rot(x, a) ^ rot(x, b)
	const rot2Inv = (x, a, b) => {
		x = rot2(x,a,b); a = (a+a) & (bits-1); b = (b+b) & (bits-1)
		x = rot2(x,a,b); a = (a+a) & (bits-1); b = (b+b) & (bits-1)
		x = rot2(x,a,b); a = (a+a) & (bits-1); b = (b+b) & (bits-1)
		x = rot2(x,a,b); a = (a+a) & (bits-1); b = (b+b) & (bits-1)
		x = rot2(x,a,b)
		return x
	}
	return Object.freeze({
		bits,
		maxVal,
		rot,
		rot2,
		rot2Inv,
	})
}

export const xorRot4  = fnXorRotate2(4)
export const xorRot8  = fnXorRotate2(8)
export const xorRot16 = fnXorRotate2(16)
// does not work
// export const xorRot24 = fnXorRotate2(24)
export const xorRot32 = fnXorRotate2(32)
