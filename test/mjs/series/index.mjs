
// more elegant but less efficient
import {
	series as seriesModule,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';
import {
	testSegmentRandom,
} from './segment.mjs';
import {
	testAverageTime,
	testAverageValue,
} from './average.mjs';

const {
	random: {
		randSeries,
	},
	print: {
		printSeries,
	}
} = seriesModule;

console.log(`\nTest series as ESM\n`);

const series = randSeries(15, 35, 0, 100, 0, 100);

testSegmentRandom(series, -50, 150, 10, 30);

printSeries(series).forEach((s) => console.log(s));

testAverageTime(series, 10, 10);
testAverageValue(series, 10, 10);

testAverageTime(series, 10, 40, false, false);
testAverageTime(series, 10, 40, false, true);
testAverageValue(series, 10, 40, false, false);
testAverageValue(series, 10, 40, false, true);
