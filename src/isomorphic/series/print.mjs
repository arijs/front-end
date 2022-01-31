import {
	getTimeOfSeriesItem,
	getValueOfSeriesItem,
} from './base.mjs'

export function printItem(o, gt = getTimeOfSeriesItem, gv = getValueOfSeriesItem) {
	return o
		? `t ${String(gt(o)).padStart(3)} v ${String(gv(o)).padStart(3)}`
		: o;
}

export function printSeries(s, gt, gv) {
	if (!(s instanceof Array)) {
		throw new Error(`printSeries: series is not an array`);
	}
	return s.map(
		(o, i) => `- ${String(i).padStart(3)} - ${printItem(o, gt, gv)}`
	);
}

export function printCutSum(cut, gt, gv) {
	const { cutBefore, cutBeforeSimul, cutAfter, cutAfterSimul, sum } = cut;
	return {
		cutBefore: printItem(cutBefore, gt, gv),
		cutBeforeSimul,
		cutAfter: printItem(cutAfter, gt, gv),
		cutAfterSimul,
		sum: printItem(sum, gt, gv),
	};
}

export function printSegment({ meta, segment, cut }, gt, gv) {
	return {
		meta,
		segment: {
			before: printItem(segment.before, gt, gv),
			first: printItem(segment.first, gt, gv),
			inside: printSeries(segment.inside, gt, gv),
			last: printItem(segment.last, gt, gv),
			after: printItem(segment.after, gt, gv),
		},
		cut: printCutSum(cut, gt, gv),
	};
}

export function printAvgFullInfo({ cut, cutPrev }, gt, gv, withPrev) {
	return {
		cut: cut && printSegment(cut, gt, gv),
		cutPrev: cutPrev && withPrev ? printSegment(cutPrev, gt, gv) : undefined,
		simul: cut?.cut?.cutBeforeSimul || cut?.cut?.cutAfterSimul,
	};
}

export function printAvgFullInfoList(s, gt, gv, withPrev) {
	if (!(s instanceof Array)) {
		throw new Error(`printAvgFullInfoList: series is not an array`);
	}
	return s.map(avg => printAvgFullInfo(avg, gt, gv, withPrev));
}

export function printAverageHole(hole, gt, gv) {
	const { tPos, tNext, tStart, cutPrev, cutLast, start, end } = hole;
	return {
		tPos,
		tNext,
		tStart,
		cutPrev: printSegment(cutPrev, gt, gv),
		cutLast: printSegment(cutLast, gt, gv),
		start: printItem(start, gt, gv),
		end: printItem(end, gt, gv),
	};
}

export function printAverage(obj, gt, gv, printList = printSeries) {
	const { avg, sum, holes } = obj;
	return {
		avg: printList(avg, gt, gv),
		sum: printItem(sum, gt, gv),
		holes: holes.map((h) => printAverageHole(h, gt, gv)),
	};
}
