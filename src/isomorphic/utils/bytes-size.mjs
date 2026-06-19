
export default function bytesSize(b, { extraDecimals = 0 } = {}) {
	var x = 1024;
	var max = [
		[0, 0, 'B'],
		[x, 0, 'kB'],
		[x*x, 1, 'MB'],
		[x*x*x, 2, 'GB'],
		[x*x*x*x, 3, 'TB']
	];
	var mi = 0, m;
	do {
		m = max[mi++];
	} while (max[mi] && b >= max[mi][0]);
	// ponytail: extraDecimals only applies to sized units; raw bytes stay integer.
	// clamp to toFixed's valid 0..100 range so a wild extraDecimals can't throw.
	var dec = Math.min(100, Math.max(0, m[0] ? m[1] + extraDecimals : m[1]));
	b = Number(m[0] ? b/m[0] : b).toFixed(dec);
	return [b, m[2]];
}
