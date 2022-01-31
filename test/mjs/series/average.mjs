
// more elegant but less efficient
import {
	series as seriesModule,
//} from '../../../lib/server/index';
} from '@arijs/frontend/server/index';

const {
	base: {
		getTimeOfSeriesItem,
		getValueOfSeriesItem,
		createSeriesItemInverted,
		betweenOneSideTimeOverflow,
		csAvgGetFullInfoFromCut,
		calcSeriesAverage,
	},
	print: {
		printAvgFullInfoList,
		printAverage,
	}
} = seriesModule;

function printAvgPrint(avgPrint) {
	avgPrint.avg.forEach((s) => console.log(s));
	console.log(avgPrint.sum);
	avgPrint.holes.forEach((h, i) => {
		console.log(`Hole ${i}`);
		console.log(h);
	});
}

export function testAverageTime(series, resolution, average, fullInfo, b1sOverflow) {

	console.log(`Average over time:`);
	const avgSeries = calcSeriesAverage(
		series, resolution, average,
		undefined,
		undefined,
		undefined,
		fullInfo
			? csAvgGetFullInfoFromCut
			: undefined,
		b1sOverflow
			? betweenOneSideTimeOverflow
			: undefined,
	);
	const avgPrint = printAverage(
		avgSeries,
		undefined,
		undefined,
		fullInfo
			? printAvgFullInfoList
			: undefined,
	);
	printAvgPrint(avgPrint);

}

export function testAverageValue(series, resolution, average, fullInfo, b1sOverflow) {

	console.log(`Average over size:`);
	const avgSeries = calcSeriesAverage(
		series, resolution, average,
		getValueOfSeriesItem,
		getTimeOfSeriesItem,
		createSeriesItemInverted,
		fullInfo
			? csAvgGetFullInfoFromCut
			: undefined,
		b1sOverflow
			? betweenOneSideTimeOverflow
			: undefined,
	);
	const avgPrint = printAverage(
		avgSeries,
		undefined,
		undefined,
		fullInfo
			? printAvgFullInfoList
			: undefined,
	);
	printAvgPrint(avgPrint);

}
