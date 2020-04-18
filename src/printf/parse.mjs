
export function printfParse(str) {
	var re = /\{\s*(?:([^{}]+?)(?:\s*\{([^{}]*)\})?\s*:)?\s*([^{}]+?)\s*\}/i;
	var parsed = [], m;
	// while (m = re.exec(str)) {
	while (m = re.exec(str)) {
		if (m.index > 0) parsed.push({text: String(str).substr(0, m.index)});
		m[2] = m[2] && queryParse(m[2]);
		parsed.push({ text: m[0], mod: m[1], params: m[2], key: m[3] });
		str = String(str).substr(m.index + m[0].length);
	}
	if (str.length) parsed.push({text: str});
	return parsed;
}
