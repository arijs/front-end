
export function pages(n, steps, offset = 0) {
	if (!(steps instanceof Array)) steps = [1, 2, 5, 10];
	var m = n * 0.5;
	var mult = 1;
	var d = [];
	var si = 0;
	var sc = steps.length;
	var sl = 0;
	while (si < sc) {
		var sp = steps[si];
		var p = sp * mult;
		if (p > m) {
			sl = p;
			break;
		}
		d.push(p + offset);
		si += 1;
		if (si == sc) {
			mult *= steps[si-1];
			si = steps[0] > 1 ? 0 : 1;
		}
	}
	var dr = [];
	for (si = 0, sc = d.length; si < sc; si++) {
		dr.unshift((n + 1) - (d[si] - offset) + offset);
	}
	var dm = sl > 0 && sl < (n + 1) && (!dr.length || (sl + offset) < dr[0]) ? [sl + offset] : [];
	// console.log(`Pages`, { n, steps, offset, d, dm, dr })
	return d.concat(dm, dr);
}

export function pagesCurrent(current, total, steps) {
	return current < 1 || total < current
		? pages(total, steps, 0)
		: pages(current - 1, steps, 0)
		.concat([current])
		.concat(pages(total - current, steps, current));
}
