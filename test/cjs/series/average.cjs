
// more elegant but less efficient
const {
	series: {
		base: {
			getTimeOfSeriesItem,
			getValueOfSeriesItem,
			createSeriesItemInverted,
			betweenOneSideTimeClip,
			csAvgGetFullInfoFromCut,
			calcSeriesAverage,
		},
		print: {
			printAvgFullInfoList,
			printAverage,
		},
	},
} = require('@arijs/frontend/server/index');

exports.testAverageTime = testAverageTime
exports.testAverageValue = testAverageValue

function printAvgPrint(avgPrint) {
	avgPrint.avg.forEach((s) => console.log(s));
	console.log(avgPrint.sum);
	avgPrint.holes.forEach((h, i) => {
		console.log(`Hole ${i}`);
		console.log(h);
	});
}

function testAverageTime(series, resolution, average, fullInfo, b1sOverflow) {

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
			? undefined
			: betweenOneSideTimeClip,
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

function testAverageValue(series, resolution, average, fullInfo, b1sOverflow) {

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
			? undefined
			: betweenOneSideTimeClip,
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
