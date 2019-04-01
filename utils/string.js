(function(vars) {

var Utils;
var string = {};
vars.Utils = Utils = vars.Utils || {};
Utils.string = string;

string.levenshtein = levenshtein;
function levenshtein(a, b) {
	var cost;
	var m = a.length;
	var n = b.length;

	// make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
	if (m < n) {
		var c = a; a = b; b = c;
		var o = m; m = n; n = o;
	}

	var r = []; r[0] = [];
	for (var c = 0; c < n + 1; ++c) {
		r[0][c] = c;
	}

	for (var i = 1; i < m + 1; ++i) {
		r[i] = []; r[i][0] = i;
		for ( var j = 1; j < n + 1; ++j ) {
			cost = a.charAt( i - 1 ) === b.charAt( j - 1 ) ? 0 : 1;
			r[i][j] = Math.min( r[i-1][j] + 1, r[i][j-1] + 1, r[i-1][j-1] + cost );
		}
	}

	return r.pop().pop();
}

string.levenshteinLength = levenshteinLength;
function levenshteinLength(a, b) {
	return {
		distance: levenshtein(a, b),
		aLength: a.length,
		bLength: b.length
	};
}

var deaccentize;
string.deaccentize = deaccentize = (function() {

function setChars(chars, objList) {
	var ollen = objList && objList.length;
	if ( !ollen ) return;
	for ( var k in chars ) {
		if ( chars.hasOwnProperty(k) ) {
			var list = chars[k];
			for ( var i = 0, ii = list.length; i < ii; i++ ) {
				for ( var j = 0; j < ollen; j++ ) {
					objList[j][list[i]] = k;
				}
			}
		}
	}
}

var charBasic = {
	A: 'ÀÁÂÃÄÅ', a: 'àáâãäå',
	C: 'Ç',      c: 'ç',
	E: 'ÈÉÊË',   e: 'èéêë',
	I: 'ÌÍÎÏ',   i: 'ìíîï',
	N: 'Ñ',      n: 'ñ',
	O: 'ÒÓÔÕÖØ', o: 'òóôõöø',
	U: 'ÙÚÛÜ',   u: 'ùúûü',
	Y: 'ÝŸ',     y: 'ýÿ'
};
var charAdvanced = {
	A: 'ĀĂĄ',    a: 'āăą',
	C: 'ĆĈĊČ',   c: 'ćĉċč',
	D: 'ĎĐ',     d: 'ďđ',
	E: 'ĒĔĖĘĚ',  e: 'ēĕėęě',
	G: 'ĜĞĠĢ',   g: 'ĝğġģ',
	H: 'ĤĦ',     h: 'ĥħ',
	I: 'ĨĪĬĮİ',  i: 'ĩīĭįı',
	J: 'Ĵ',      j: 'ĵ',
	K: 'Ķ',      k: 'ķ',
	L: 'ĹĻĽĿŁ',  l: 'ĺļľŀł',
	N: 'ŃŅŇ',    n: 'ńņň',
	O: 'ŌŎŐ',    o: 'ōŏő',
	R: 'ŔŖŘ',    r: 'ŕŗř',
	S: 'ŚŜŞŠ',   s: 'śŝşš',
	T: 'ŢŤŦ',    t: 'ţťŧ',
	U: 'ŨŪŬŮŰŲ', u: 'ũūŭůűų',
	W: 'Ŵ',      w: 'ŵ',
	Y: 'Ŷ',      y: 'ŷ',
	Z: 'ŹŻŽ',    z: 'źżž'
};
var basic    = {};
var advanced = {};
var all      = {};

setChars(charBasic, [basic, all]);
setChars(charAdvanced, [advanced, all]);

function deaccentize(s, charMap) {
	var t = '';
	charMap || (charMap = all);
	for ( var i = 0, ii = s.length; i < ii; i++ ) {
		var sc = s[i],
			tc = charMap[sc];
		t += tc || sc;
	}
	return t;
}

deaccentize.basic    = basic;
deaccentize.advanced = advanced;
deaccentize.all      = all;

return deaccentize;

})();

var reSpaces;
string.reSpaces = reSpaces = /^\s*|\s+(?=\s)|\s*$/g;

string.getViews = getViews;
function getViews(raw) {
	var trim = String(raw).replace(reSpaces, '');
	var lower = trim.toLowerCase();
	var noacc = deaccentize(lower);
	return {
		raw: raw,
		trim: trim,
		lower: lower,
		noacc: noacc
	};
}

string.getDistance = getDistance;
function getDistance(a, b) {
	return {
		raw: levenshteinLength(a.raw, b.raw),
		trim: levenshteinLength(a.trim, b.trim),
		lower: levenshteinLength(a.lower, b.lower),
		noacc: levenshteinLength(a.noacc, b.noacc)
	};
}

string.compareViews = compareViews;
function compareViews(a, b) {
	return ( a.noacc !== b.noacc ? ( a.noacc < b.noacc ? -1 : +1 ) :
		( a.lower !== b.lower ? ( a.lower < b.lower ? -1 : +1 ) :
		( a.trim !== b.trim ? ( a.trim < b.trim ? -1 : +1 ) :
		( a.raw !== b.raw ? ( a.raw < b.raw ? -1 : +1 ) :
		0 ) ) ) );
}

string.search = search;
function search(searchTerm, maxCount, maxDistance, merge) {
	function testMaxDistanceDefault(item) {
		var dsrc = item.distSrc;
		var dist = item.dist;
		if (dsrc.noacc.distance === dsrc.noacc.bLength) {
			return false;
		}
		if (maxDistance >= 0) {
			if (dist.noacc > maxDistance) {
				return false;
			}
		} else if (String(maxDistance) === String({})) {
			if (
				(maxDistance.noacc >= 0 && dist.noacc > maxDistance.noacc) ||
				(maxDistance.lower >= 0 && dist.lower > maxDistance.lower) ||
				(maxDistance.trim >= 0 && dist.trim > maxDistance.trim) ||
				(maxDistance.raw >= 0 && dist.raw > maxDistance.raw)
			) {
				return false;
			}
		}
		return true;
	}
	function mergeDefault(closest, item, index, total) {
		if (maxCount > 0) {
			if (index < maxCount) {
				closest.splice(index, 0, item);
				closest.splice(maxCount, total - maxCount);
			}
		} else {
			closest.splice(index, 0, item);
		}
		return closest;
	}
	function getDistanceObject(str, data) {
		var d = getDistance(searchTerm, getViews(str));
		return {
			data: data,
			str: str,
			distSrc: d,
			dist: {
				raw: d.raw.distance + d.raw.aLength - d.raw.bLength,
				trim: d.trim.distance + d.trim.aLength - d.trim.bLength,
				lower: d.lower.distance + d.lower.aLength - d.lower.bLength,
				noacc: d.noacc.distance + d.noacc.aLength - d.noacc.bLength
			}
		};
	}
	function insert(str, data) {
		var item = getDistanceObject(str, data);
		if (testMaxDistance(item)) {
			for (var i = 0, ii = closest.length; i < ii; i++) {
				var itemComp = compareViews(item.dist, closest[i].dist);
				if (itemComp < 0) break;
			}
			closest = merge(closest, item, i, ii);
		}
	}
	function getClosest(cutDistance) {
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
			c = c.slice(0, i);
		}
		return c;
	}
	var testMaxDistance = maxDistance instanceof Function ? maxDistance : testMaxDistanceDefault;
	if (null == maxCount) maxCount = 0;
	if (!(merge instanceof Function)) merge = mergeDefault;
	var closest = [];
	searchTerm = getViews(searchTerm);
	return {
		distance: getDistanceObject,
		insert: insert,
		getClosest: getClosest
	};
}

})(window._var$);
