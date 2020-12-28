
export default function bytesSize(b) {
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
	b = Number(m[0] ? b/m[0] : b).toFixed(m[1]);
	return [b, m[2]];
}
