
export const ipv4Conf = {
	chars: /^[\d.]+$/,
	sep: /\.|$/g,
	group: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
	minGroups: 4,
	maxGroups: 4
};

export const ipv6Conf = {
	chars: /^[\dA-Fa-f:]+$/,
	sep: /::?|$/g,
	group: /^[\dA-Fa-f]{0,4}$/,
	minGroups: 0,
	maxGroups: 8
};

export const ipv6w4Conf = {
	chars: /^[\dA-Fa-f:\.]+$/,
	sep: /::?|\.|$/g,
	group: /^[\dA-Fa-f]{0,4}$/,
	minGroups: 0,
	maxGroups: 10
};

// const reEnd = /$/;

export function ipToArray(ip, conf) {
	if (!conf.chars.test(ip)) return;
	var list = [];
	var csep = conf.sep;
	var cgrp = conf.group;
	var valid = true;
	var sindex = 0;
	var lmax = 128;
	var smat, g, gval;
	while (smat = csep.exec(ip)) {
		if (sindex === ip.length) break;
		if (lmax-- <= 0) {
			valid = false;
			break;
		}
		g = ip.substr(sindex, smat.index-sindex);
		gval = cgrp.test(g);
		valid = valid && gval;
		list.push({
			group: g,
			valid: gval,
			sep: smat[0],
			'if': smat.index,
			'il': csep.lastIndex
		});
		sindex = csep.lastIndex;
	}
	csep.lastIndex = 0;
	return {
		valid: valid,
		list: list
	};
}

export default ipToArray;

// console.log((ipToArray('::ffff:177.140.246.221', ipv6w4Conf) || {}).list);
