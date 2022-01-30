
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

function testAverage(series, resolution, average) {

	console.log(`Average over time:`);
	const avgVT = calcSeriesAverage(
		series, resolution, average,
		// undefined,
		// undefined,
		// undefined,
		// csAvgGetFullInfoFromCut
	);
	const avgPrintVT = printAverage(
		avgVT,
		// undefined,
		// undefined,
		// printAvgFullInfoList
	);
	avgPrintVT.avg.forEach((s) => console.log(s));
	console.log(avgPrintVT.sum);
	avgPrintVT.holes.forEach((s) => console.log(s));

	console.log(`Average over size:`);
	const avgTV = calcSeriesAverage(
		series, resolution, average,
		getValueOfSeriesItem,
		getTimeOfSeriesItem,
		createSeriesItemInverted
	);
	const avgPrintTV = printAverage(avgTV);
	avgPrintTV.avg.forEach((s) => console.log(s));
	console.log(avgPrintTV.sum);
	avgPrintTV.holes.forEach((h, i) => {
		console.log(`Hole ${i}`);
		console.log(h);
	});

}
