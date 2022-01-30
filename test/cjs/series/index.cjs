
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
	testAverage,
} = require('./average.cjs');

console.log(`\nTest series as CJS\n`);

const series = randSeries(15, 35, 0, 100, 0, 100);

testSegmentRandom(series, -50, 150, 10, 30);

printSeries(series).forEach((s) => console.log(s));

testAverage(series, 10, 10);

testAverage(series, 10, 40);
