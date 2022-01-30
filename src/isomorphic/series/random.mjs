import {
	getSegment,
	getSegmentCutAndSum,
} from './base.mjs'

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function numSort(a, b) {
	return a - b;
}

export function randSeries(minCount, maxCount, minTime, maxTime, minValue, maxValue) {
	const count = rand(minCount, maxCount);
	const times = [];
	const values = [];
	const series = [];
	for (let i = 0; i < count; i++) {
		times.push(Math.round(rand(minTime, maxTime)));
		values.push(Math.round(rand(minValue, maxValue)));
	}
	times.sort(numSort);
	values.sort(numSort);
	for (let i = 0; i < count; i++) {
		series.push([times[i], values[i]]);
	}
	series.unshift([minTime, minValue]);
	series.push([maxTime, maxValue]);
	return series;
}

export function randSegment(
	series,
	minTime,
	maxTime,
	minLength,
	maxLength,
	gt,
	gv,
	ci
) {
	const length = Math.round(rand(minLength, maxLength));
	const start = Math.round(rand(minTime, maxTime - length));
	const end = start + length;
	const segment = getSegment(series, start, end, gt, gv);
	const cut = getSegmentCutAndSum(segment, start, end, gt, gv, ci);
	return {
		meta: {
			start,
			length,
			end,
		},
		segment,
		cut,
	};
}
