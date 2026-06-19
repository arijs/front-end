
// Assertion test: pins the "series" functions to the known-good behavior
// captured from the (tested) transfer-speed project. Deterministic input,
// frozen expected output — fails if front-end ever drifts from that behavior.
const assert = require('node:assert/strict');
const {
	series: {
		base,
		print,
	},
} = require('@arijs/frontend/server/index');

// Fixed series (no RNG) so expected values stay stable.
const SERIES = [[0,0],[3,10],[7,10],[7,25],[12,40],[20,55],[20,55],[31,90],[45,120],[60,150]];

// Golden values verified equal to transfer-speed/core/speed-series.js + print-series.js.
const EXPECTED = {"segment":{"meta":{"start":10,"length":30,"end":40},"segment":{"before":[7,25],"first":[12,40],"inside":[[12,40],[20,55],[20,55],[31,90]],"last":[31,90],"after":[45,120]},"cut":{"cutBefore":[10,34],"cutBeforeSimul":false,"cutAfter":[40,109.28571428571429],"cutAfterSimul":false,"sum":[30,75.28571428571429]}},"segmentPrint":{"meta":{"start":10,"length":30,"end":40},"segment":{"before":"t   7 v  25","first":"t  12 v  40","inside":["-   0 - t  12 v  40","-   1 - t  20 v  55","-   2 - t  20 v  55","-   3 - t  31 v  90"],"last":"t  31 v  90","after":"t  45 v 120"},"cut":{"cutBefore":"t  10 v  34","cutBeforeSimul":false,"cutAfter":"t  40 v 109.28571428571429","cutAfterSimul":false,"sum":"t  30 v 75.28571428571429"}},"avg":{"avg":[[15,17.5,1.1666666666666667],[15,34,2.2666666666666666],[15,45.625,3.0416666666666665],[15,37.5,2.5],[15,36.90909090909091,2.4606060606060605],[15,41.19318181818181,2.7462121212121207],[15,43.57142857142857,2.9047619047619047],[15,38.376623376623385,2.558441558441559],[15,33.18181818181819,2.2121212121212124],[15,31.42857142857143,2.0952380952380953],[15,30.714285714285708,2.047619047619047],[15,30,2]],"sum":[180,420.00000000000006],"holes":[],"sLen":10,"tMin":0,"tMax":60},"avgPrint":{"avg":["-   0 - t  15 v 17.5 s 1.1666666666666667","-   1 - t  15 v  34 s 2.2666666666666666","-   2 - t  15 v 45.625 s 3.0416666666666665","-   3 - t  15 v 37.5 s 2.5","-   4 - t  15 v 36.90909090909091 s 2.4606060606060605","-   5 - t  15 v 41.19318181818181 s 2.7462121212121207","-   6 - t  15 v 43.57142857142857 s 2.9047619047619047","-   7 - t  15 v 38.376623376623385 s 2.558441558441559","-   8 - t  15 v 33.18181818181819 s 2.2121212121212124","-   9 - t  15 v 31.42857142857143 s 2.0952380952380953","-  10 - t  15 v 30.714285714285708 s 2.047619047619047","-  11 - t  15 v  30 s   2"],"sum":"t 180 v 420.00000000000006","holes":[]},"speeds":[[0,0,0],[3,10,3.3333333333333335],[7,10,1.4285714285714286],[7,25,3.5714285714285716],[12,40,3.3333333333333335],[20,55,2.75],[20,55,2.75],[31,90,2.903225806451613],[45,120,2.6666666666666665],[60,150,2.5]],"deltas":[[0,0],[3,10],[4,0],[0,15],[5,15],[8,15],[0,0],[11,35],[14,30],[15,30]],"speedsAcc":[[0,0,0],[3,10,3.3333333333333335],[7,10,1.4285714285714286],[7,25,3.5714285714285716],[12,40,3.3333333333333335],[20,55,2.75],[20,55,2.75],[31,90,2.903225806451613],[45,120,2.6666666666666665],[60,150,2.5]]};

const actual = {
	segment: base.getSegmentCutAndSumFromSeries(SERIES, 10, 40),
	segmentPrint: print.printSegment(base.getSegmentCutAndSumFromSeries(SERIES, 10, 40)),
	avg: base.calcSeriesAverage(SERIES, 5, 15),
	avgPrint: print.printAverage(base.calcSeriesAverage(SERIES, 5, 15)),
	speeds: base.calcSeriesSpeedsAtEachInterval(SERIES, base.SERIES_TIME_UNIT.INTERVAL),
	deltas: base.convertSeriesAccumulatedToDeltas(SERIES),
	speedsAcc: base.calcSeriesSpeedsAverageAccumulated(SERIES),
};

for (const key of Object.keys(EXPECTED)) {
	assert.deepStrictEqual(actual[key], EXPECTED[key], `series parity mismatch: ${key}`);
}

console.log('series parity: OK (7 checks)');
