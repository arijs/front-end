
export default function weightNum(vals, weights, wSum) {
	wSum = (null == wSum && null != weights
		? weights.reduce((a, b) => a + (b || 0), 0)
		: wSum) || vals.length
	let sum = 0
	vals.forEach((v, i) => {
		sum += weights ? v * (weights[i] || 0) : v
	})
	sum /= wSum
	return sum
}
