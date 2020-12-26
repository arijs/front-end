import levenshtein from './levenshtein.mjs';
import getViews from './normalize-views.mjs';

export function levenshteinLength(a, b) {
	return {
		distance: levenshtein(a, b),
		aLength: a.length,
		bLength: b.length
	};
}

export function getDistance(a, b) {
	return {
		raw: levenshteinLength(a.raw, b.raw),
		trim: levenshteinLength(a.trim, b.trim),
		lower: levenshteinLength(a.lower, b.lower),
		noacc: levenshteinLength(a.noacc, b.noacc)
	};
}

export function getDistanceObject(aViews, bViews) {
	var d = getDistance(aViews, bViews);
	return {
		distSrc: d,
		dist: {
			raw: d.raw.distance + d.raw.aLength - d.raw.bLength,
			trim: d.trim.distance + d.trim.aLength - d.trim.bLength,
			lower: d.lower.distance + d.lower.aLength - d.lower.bLength,
			noacc: d.noacc.distance + d.noacc.aLength - d.noacc.bLength
		}
	};
}

export function compareDistanceObjects(a, b) {
	return ( a.noacc !== b.noacc ? ( a.noacc < b.noacc ? -1 : +1 ) :
		( a.lower !== b.lower ? ( a.lower < b.lower ? -1 : +1 ) :
		( a.trim !== b.trim ? ( a.trim < b.trim ? -1 : +1 ) :
		( a.raw !== b.raw ? ( a.raw < b.raw ? -1 : +1 ) :
		0 ) ) ) );
}

export function mergeClosest(closest, item, index, maxCount, total) {
	if (null == total || isNaN(total)) { // because null
		total = closest.length;
	}
	if (maxCount > 0) {
		if (index < maxCount) {
			// this is more efficient because we only insert
			// if index is lower than maxCount
			closest.splice(index, 0, item);
			closest.splice(maxCount, total - maxCount);
			return true;
		}
	} else {
		closest.splice(index, 0, item);
		return true;
	}
	return false;
}

export function testMaxDistanceObject(item, maxDistance) {
	var dsrc = item.distSrc;
	var dist = item.dist;
	if (null == maxDistance) {
		return true;
	} else if (dsrc.noacc.distance === dsrc.noacc.bLength) {
		return false;
	} else if (maxDistance >= 0) {
		return !(dist.noacc > maxDistance);
	} else if ('object' === typeof maxDistance) {
		return !(
			(maxDistance.noacc >= 0 && dist.noacc > maxDistance.noacc) ||
			(maxDistance.lower >= 0 && dist.lower > maxDistance.lower) ||
			(maxDistance.trim >= 0 && dist.trim > maxDistance.trim) ||
			(maxDistance.raw >= 0 && dist.raw > maxDistance.raw)
		);
	}
	return true;
}

export function insertClosest(closest, searchViews, str, data, maxDistance, maxCount) {
	var {distSrc, dist} = getDistanceObject(searchViews, getViews(str));
	if (testMaxDistanceObject(dist, maxDistance)) {
		for (var i = 0, ii = closest.length; i < ii; i++) {
			var itemComp = compareDistanceObjects(dist, closest[i].dist);
			if (itemComp < 0) break;
		}
		return mergeClosest(closest, {distSrc, dist, str, data}, i, maxCount, ii);
	}
	return false;
}

export function cutClosestDistance(closest, cutDistance) {
	// this function will discard entries that are more than
	// 'X' chars away from the first search result
	var c = closest.slice();
	var count = c.length;
	var dFirst = (c[0] || {}).dist;
	if (cutDistance && dFirst) {
		var dCut = {
			raw: cutDistance.raw == null ? null : dFirst.raw + cutDistance.raw,
			trim: cutDistance.trim == null ? null : dFirst.trim + cutDistance.trim,
			lower: cutDistance.lower == null ? null : dFirst.lower + cutDistance.lower,
			noacc: cutDistance.noacc == null ? null : dFirst.noacc + cutDistance.noacc
		}
		for (var i = 1; i < count; i++) {
			var d = c[i].dist;
			if (
				( dCut.raw != null && d.raw > dCut.raw ) ||
				( dCut.trim != null && d.trim > dCut.trim ) ||
				( dCut.lower != null && d.lower > dCut.lower ) ||
				( dCut.noacc != null && d.noacc > dCut.noacc )
			) break;
		}
		c.splice(i, count - i);
	}
	return c;
}

export function search(opt) {
	var closest = [];
	var searchTerm;
	var maxCount;
	var maxDistance;
	var cutDistance;
	'object' === typeof opt && init(opt);
	return {
		clear,
		init,
		getDistance,
		insert,
		getClosest,
	};
	function clear() {
		closest = [];
	}
	function init({searchTerm: st, maxCount: mc, maxDistance: md, cutDistance: cd}) {
		if (null != st) searchTerm = getViews(st);
		if (null != mc) maxCount = mc;
		if (null != md) maxDistance = md;
		if (null != cd) cutDistance = cd;
	}
	function getDistance(str) {
		return getDistanceObject(searchTerm, getViews(str));
	}
	function insert(str, data) {
		return insertClosest(closest, searchTerm, str, data, maxDistance, maxCount);
	}
	function getClosest() {
		return cutClosestDistance(closest, cutDistance);
	}
}

export default search;
