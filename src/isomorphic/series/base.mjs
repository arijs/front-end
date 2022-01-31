
export function getTimeOfSeriesItem(item) {
	return item[0];
}

export function getValueOfSeriesItem(item) {
	return item[1];
}

export function createSeriesItem(time, value) {
	return [time, value];
}

export function createSeriesItemInverted(time, value) {
	return [value, time];
}

export function reduceValueLesser(item1, item2, gv = getValueOfSeriesItem) {
	const v1 = gv(item1);
	const v2 = gv(item2);
	return v2 < v1 ? item2 : item1;
}

export function reduceValueGreater(item1, item2, gv = getValueOfSeriesItem) {
	const v1 = gv(item1);
	const v2 = gv(item2);
	return v2 > v1 ? item2 : item1;
}

export function getSegment(
	series,
	minTime,
	maxTime,
	gt = getTimeOfSeriesItem,
	gv = getValueOfSeriesItem,
	reduceBefore = reduceValueGreater,
	reduceFirst = reduceValueGreater,
	reduceLast = reduceValueGreater,
	reduceAfter = reduceValueGreater
) {
	let before = undefined;
	let after = undefined;
	let first = undefined;
	let last = undefined;
	const inside = [];
	const count = series.length;
	for (let i = 0; i < count; i++) {
		const item = series[i];
		const gtItem = gt(item);
		if (gtItem < minTime) {
			const gtBefore = before && gt(before);
			const gtBeforeEqual = gtBefore === gtItem
			if (!before || gtItem >= gtBefore) {
				before = gtBeforeEqual
					? reduceBefore(item, before, gv)
					: item;
			}
		}
		if (gtItem >= minTime && gtItem <= maxTime) {
			inside.push(item);
			const gtFirst = first && gt(first);
			const gtFirstEqual = gtFirst === gtItem;
			if (!first || gtFirstEqual) {
				first = gtFirstEqual
					? reduceFirst(item, first, gv)
					: item;
				if (gt(first) == minTime) {
					before = undefined;
				}
			}
			const gtLast = last && gt(last);
			const gtLastEqual = gtLast === gtItem;
			last = gtLastEqual
				? reduceLast(item, last, gv)
				: item;
		}
		if (gtItem > maxTime) {
			const gtAfter = after && gt(after);
			const gtAfterEqual = gtAfter === gtItem;
			if (!after || gtAfterEqual) {
				//  || gtItem == gtAfter
				if (!last || gt(last) < maxTime) {
					//   after = item;
					after = gtAfterEqual
						? reduceAfter(item, after, gv)
						: item;
				}
			} else if (gtItem > gtAfter) {
				break;
			}
		}
	}
	return {
		before,
		first,
		inside,
		last,
		after,
	};
}

export function betweenOneSideTimeClip(inside) {
	return inside
}

export function betweenOneSideTimeOverflow(inside, cut, gt, gv, ci) {
	return ci(cut, gv(inside));
}

export function calcItemBetween(
	cut,
	before,
	after,
	gt = getTimeOfSeriesItem,
	gv = getValueOfSeriesItem,
	ci = createSeriesItem,
	b1s = betweenOneSideTimeClip,
) {
	if (before && after) {
		const tStart = gt(before);
		const tEnd = gt(after);
		const tDuration = tEnd - tStart;
		const fracFirst = (cut - tStart) / tDuration;
		const vStart = gv(before);
		const vEnd = gv(after);
		const vDuration = vEnd - vStart;
		return ci(cut, fracFirst * vDuration + vStart);
	} else if (before) {
		return b1s(before, cut, gt, gv, ci);
	} else if (after) {
		return b1s(after, cut, gt, gv, ci);
	} else {
		throw new Error(`Cannot calculate value between without before or after`);
	}
}

export function getSegmentCutAndSum(
	segment,
	start,
	end,
	gt = getTimeOfSeriesItem,
	gv = getValueOfSeriesItem,
	ci = createSeriesItem,
	b1s,
) {
	const { before, first, last, after } = segment;
	const cutBefore = first
		? calcItemBetween(start, before, first, gt, gv, ci, b1s)
		: before && after
		? calcItemBetween(start, before, after, gt, gv, ci, b1s)
		: undefined;
	const cutAfter = last
		? calcItemBetween(end, last, after, gt, gv, ci, b1s)
		: before && after
		? calcItemBetween(end, before, after, gt, gv, ci, b1s)
		: undefined;
	const time = cutBefore && cutAfter ? gt(cutAfter) - gt(cutBefore) : 0;
	const value = cutBefore && cutAfter ? gv(cutAfter) - gv(cutBefore) : 0;
	const sum = cutBefore && cutAfter ? ci(time, value) : undefined;
	return {
		cutBefore,
		cutBeforeSimul: !first,
		cutAfter,
		cutAfterSimul: !last,
		sum,
	};
}

export function getSegmentCutAndSumFromSeries(series, start, end, gt, gv, ci, rb, rf, rl, ra, b1s) {
	const length = end - start;
	const meta = {
		start,
		length,
		end,
	};
	const segment = getSegment(series, start, end, gt, gv, rb, rf, rl, ra);
	const cut = getSegmentCutAndSum(segment, start, end, gt, gv, ci, b1s);
	return { meta, segment, cut };
}

export function csAvgGetSumFromCut(cut) {
	return cut.cut.sum;
}

export function csAvgGetFullInfoFromCut(cut, cutPrev) {
	return { cut, cutPrev };
}

export function calcSeriesAverage(
	series,
	resolution,
	average,
	gt = getTimeOfSeriesItem,
	gv = getValueOfSeriesItem,
	ci = createSeriesItem,
	getInfoFromCut = csAvgGetSumFromCut,
	b1s
) {
	const sLen = series.length;
	const tMin = gt(series[0]);
	const tMax = gt(series[sLen - 1]);
	const avg = [];
	const holes = [];
	let currentHole = undefined;
	let lastCut = undefined;
	let prevCut = undefined;
	let tPos = tMin;
	let tSum = 0;
	let vSum = 0;
	while (tPos < tMax) {
		const tNext = tPos + resolution;
		prevCut = lastCut;
		lastCut = getSegmentCutAndSumFromSeries(
			series,
			tNext - average,
			tNext,
			gt,
			gv,
			ci,
			prevCut ? undefined : reduceValueLesser,
			prevCut ? undefined : reduceValueLesser,
			undefined,
			undefined,
			b1s,
		);
		const { cutBefore, sum } = lastCut.cut;
		if (sum) {
			if (currentHole) {
				currentHole.end = cutBefore;
				currentHole = undefined;
			}
			avg.push(getInfoFromCut(lastCut, prevCut));
			tSum += gt(sum) * resolution / gt(sum);
			vSum += gv(sum) * resolution / gt(sum);
		} else if (!currentHole) {
			currentHole = {
				tPos,
				tNext,
				tStart: tNext - average,
				cutPrev: prevCut,
				cutLast: lastCut,
				start: prevCut?.cut.cutAfter,
				end: undefined,
			};
			holes.push(currentHole);
		}
		tPos = tNext;
	}
	const sum = ci(tSum, vSum);
	return { avg, sum, holes };
}

