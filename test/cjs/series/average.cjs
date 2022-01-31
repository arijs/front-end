
// more elegant but less efficient
const {
	series: {
		base: {
			getTimeOfSeriesItem,
			getValueOfSeriesItem,
			createSeriesItemInverted,
			calcSeriesAverage,
		},
		print: {
			printAverage,
		},
	},
} = require('@arijs/frontend/server/index');

exports.testAverage = testAverage

export function testAverage(series, resolution, average, fullInfoVT, fullInfoTV) {

	console.log(`Average over time:`);
	const avgVT = calcSeriesAverage(
		series, resolution, average,
		undefined,
		undefined,
		undefined,
		fullInfoVT
			? csAvgGetFullInfoFromCut
			: undefined,
	);
	const avgPrintVT = printAverage(
		avgVT,
		undefined,
		undefined,
		fullInfoVT
			? printAvgFullInfoList
			: undefined,
	);
	avgPrintVT.avg.forEach((s) => console.log(s));
	console.log(avgPrintVT.sum);
	avgPrintVT.holes.forEach((s) => console.log(s));

	console.log(`Average over size:`);
	const avgTV = calcSeriesAverage(
		series, resolution, average,
		getValueOfSeriesItem,
		getTimeOfSeriesItem,
		createSeriesItemInverted,
		fullInfoTV
			? csAvgGetFullInfoFromCut
			: undefined,
	);
	const avgPrintTV = printAverage(
		avgTV,
		undefined,
		undefined,
		fullInfoTV
			? printAvgFullInfoList
			: undefined,
	);
	avgPrintTV.avg.forEach((s) => console.log(s));
	console.log(avgPrintTV.sum);
	avgPrintTV.holes.forEach((h, i) => {
		console.log(`Hole ${i}`);
		console.log(h);
	});

}
