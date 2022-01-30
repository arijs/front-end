
// more elegant but less efficient
const {
	series: {
		base: {
			getTimeOfSeriesItem,
			getValueOfSeriesItem,
			createSeriesItemInverted,
		},
		random: {
			randSegment,
		},
		print: {
			printSegment,
		},
	},
} = require('@arijs/frontend/server/index');

exports.testSegmentRandom = testSegmentRandom

function testSegmentRandom(series, minTime, maxTime, minLength, maxLength) {

	const segmentVT = randSegment(series, minTime, maxTime, minLength, maxLength);
	const segPrintVT = printSegment(segmentVT);

	console.log(`Amount over time:`);
	console.log(segPrintVT.meta);
	console.log(segPrintVT.segment);
	console.log(segPrintVT.cut);

	const segmentTV = randSegment(
		series, minTime, maxTime, minLength, maxLength,
		getValueOfSeriesItem,
		getTimeOfSeriesItem,
		createSeriesItemInverted
	);
	const segPrintTV = printSegment(segmentTV);

	console.log(`Time over amount:`);
	console.log(segPrintTV.meta);
	console.log(segPrintTV.segment);
	console.log(segPrintTV.cut);

}
