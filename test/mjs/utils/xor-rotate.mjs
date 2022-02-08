
// more elegant but less efficient
import {
	utils as utilsModule,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';

const {
	xorRot8,
	xorRot16,
	xorRot32,
} = utilsModule;

runBits(xorRot8)
runBits(xorRot16)
runBits(xorRot32)

function runBits({
	bits,
	maxVal,
	rot2,
	rot2Inv,
}, randCount = 20){
	const getRand = () => (Math.random() * maxVal) >>> 0
	const p = (x, l) => x.toFixed().padStart(l)

	function run(x, a, b) {
		let t = NaN, r = NaN, d = NaN
		try {
			t = rot2(x, a, b) >>> 0
			r = rot2Inv(t, a, b) >>> 0
			d = r - x
		} finally {
			console.log(`${p(x,10)} ${p(a,2)} ${p(b,2)} = ${p(t,10)} = ${p(r, 10)} :: ${d.toFixed()}`)
		}
	}
	function runRand() {
		const x = getRand()
		const a = getRand() & (bits - 1)
		const b = getRand() & (bits - 1)
		return run(x, a, b)
		// const i = a > b
		// return run(x, i ? b : a, i ? a : b)
	}

	function runTimes(c) {
		for (let i = 0; i < c; i++) runRand()
	}

	console.log({ bits, maxVal })
	run((471490377 % maxVal) >>> 0, 1, 13 & (bits - 1))
	run((471490377 % maxVal) >>> 0, 13 & (bits - 1), 1)
	runTimes(randCount)
}
