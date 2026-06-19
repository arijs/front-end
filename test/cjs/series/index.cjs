
// more elegant but less efficient
const {
	series: {
		random: {
			randSeries,
		},
		print: {
			printSeries,
		},
	},
} = require('@arijs/frontend/server/index');
const {
	testSegmentRandom,
} = require('./segment.cjs');
const {
	testAverageTime,
	testAverageValue,
} = require('./average.cjs');

require('./parity.cjs');

console.log(`\nTest series as CJS\n`);

const series = randSeries(15, 35, 0, 100, 0, 100);

testSegmentRandom(series, -50, 150, 10, 30);

printSeries(series).forEach((s) => console.log(s));

testAverageTime(series, 10, 10);
testAverageValue(series, 10, 10);

testAverageTime(series, 10, 40, false, false);
testAverageTime(series, 10, 40, false, true);
testAverageValue(series, 10, 40, false, false);
testAverageValue(series, 10, 40, false, true);
