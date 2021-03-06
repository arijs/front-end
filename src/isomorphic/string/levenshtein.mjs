
export default function levenshtein(a, b) {
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
