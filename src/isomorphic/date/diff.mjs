
function singularPlural(n, s) {
	return s instanceof Array ? s[n == 1 ? 0 : 1] : s;
}

export default function diffDates(d1, d2, labels, secondsHide) {
	var p = true;
	var t1 = d1.getTime();
	var t2 = d2.getTime();
	if (!labels) {
		labels = {
			ano: 'a',
			mes: 'm',
			dia: 'd'
		};
	}
	if (t2 < t1) {
		p = t1;
		t1 = t2;
		t2 = p;
		p = d1;
		d1 = d2;
		d2 = p;
		p = false;
	}
	var td = t2 - t1;
	var o1 = {
		ms: d1.getMilliseconds(),
		s: d1.getSeconds(),
		m: d1.getMinutes(),
		h: d1.getHours(),
		d: d1.getDate(),
		M: d1.getMonth(),
		Mdays: 0,
		y: d1.getFullYear()
	};
	o1.Mdays = new Date(o1.y, o1.M + 1 + 1, 0).getDate();
	var o2 = {
		ms: d2.getMilliseconds(),
		s: d2.getSeconds(),
		m: d2.getMinutes(),
		h: d2.getHours(),
		d: d2.getDate(),
		M: d2.getMonth(),
		Mdays: 0,
		y: d2.getFullYear()
	};
	o2.Mdays = new Date(o2.y, o2.M + 1 + 1, 0).getDate();
	var oafter = {
		t: td,
		o1: o1,
		o2: o2,
		after: p,
		ms: o2.ms - o1.ms,
		s: o2.s - o1.s,
		m: o2.m - o1.m,
		h: o2.h - o1.h,
		d: o2.d - o1.d,
		M: o2.M - o1.M,
		y: o2.y - o1.y
	};
	var oac = {
		after: p,
		raw: oafter,
		maxPart: null,
		ms: oafter.ms,
		s: oafter.s,
		m: oafter.m,
		h: oafter.h,
		d: oafter.d,
		M: oafter.M,
		y: oafter.y
	};
	while (oac.ms < 0) {
		oac.ms += 1000;
		oac.s -= 1;
	}
	while (oac.s < 0) {
		oac.s += 60;
		oac.m -= 1;
	}
	while (oac.m < 0) {
		oac.m += 60;
		oac.h -= 1;
	}
	while (oac.h < 0) {
		oac.h += 24;
		oac.d -= 1;
	}
	while (oac.d < 0) {
		oac.d += 30; // Aproximação
		oac.M -= 1;
	}
	while (oac.M < 0) {
		oac.M += 12;
		oac.y -= 1;
	}
	oac.maxPart =
		oac.y ? 'y' :
		oac.M ? 'M' :
		oac.d ? 'd' :
		oac.h ? 'h' :
		oac.m ? 'm' :
		oac.s ? 's' :
		oac.ms ? 'ms' : null;
	var s = [];
	if (oac.y != 0) s.push(oac.y + singularPlural(Math.abs(oac.y), labels.ano));
	if (oac.M != 0) s.push(oac.M + singularPlural(Math.abs(oac.M), labels.mes));
	if (oac.d != 0 /*|| s.length == 0*/) s.push(oac.d + singularPlural(Math.abs(oac.d), labels.dia));
	oac.sd = s.join(' ');
	var st_m = oac.m;
	var st_s = oac.s;
	switch (secondsHide) {
		case 'floor': st_s = 0; break;
		case 'round': st_m += st_s >= 30 ? 1 : 0; st_s = 0; break;
		case 'ceil': st_m += st_s > 0 ? 1 : 0; st_s = 0; break;
	}
	var st = [];
	if (oac.h || st_m || (!secondsHide && st_s)) {
		st.push(String('00'+oac.h).substr(-2));
		st.push(String('00'+st_m).substr(-2));
		if (!secondsHide) st.push(String('00'+st_s).substr(-2));
	}
	oac.st = st.join(':');
	return oac;
}
