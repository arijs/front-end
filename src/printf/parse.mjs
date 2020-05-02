import {queryParse} from '../utils/query-string';

var re = /\{\s*(?:([^{}]+?)(?:\s*\{([^{}]*)\})?\s*:)?\s*([^{}]+?)\s*\}/i;

export function printfGetMatch(str) {
	var m = re.exec(str);
	if (m) {
		m[2] = m[2] && queryParse(m[2]);
		return {
			text: m[0],
			mod: m[1],
			params: m[2],
			key: m[3],
			index: m.index,
			indexEnd: m.index + m[0].length,
		};
	}
}

export function printfParse(str) {
	var parsed = [], index, m;
	str = String(str);
	// while (m = re.exec(str)) {
	while (m = printfGetMatch(str)) {
		index = m.index;
		if (index > 0) parsed.push({text: str.substr(0, index)});
		// m[2] = m[2] && queryParse(m[2]);
		// parsed.push({ text: m[0], mod: m[1], params: m[2], key: m[3] });
		parsed.push(m);
		str = str.substr(m.indexEnd);
	}
	if (str.length) parsed.push({text: str});
	return parsed;
}

export default printfParse;
