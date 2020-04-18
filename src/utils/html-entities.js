
export function encodeSpecial (str) {
	var text = document.createTextNode(str);
	var div = document.createElement('div');
	div.appendChild(text);
	return div.innerHTML;
}

export function encodeCharNum (chr, hex) {
	chr = String(chr).charCodeAt(0);
	chr = (hex?'x':'')+Number(chr).toString(hex ? 16 : 10);
	return '&#'+chr+';';
}

export function encodeCharRegex (str, reg, hex) {
	return String(str).replace(reg, function(c) {
		return encodeCharNum(c, hex);
	});
}

export function encodeSafe (str, hex) {
	return encodeCharRegex(str, /\W/g, hex);
}

export function encodeNonBasic (str, hex) {
	return encodeCharRegex(str, /[^\w:;.,~^`´!?°ªº@#$%*()\[\]{}\/\\=+-]/g);
}

export function encodeHtmlAttribute (str, hex) {
	return encodeCharRegex(str, /[\s'"=&<>]/g, hex);
}

export function decode (str) {
	var div = document.createElement('div');
	div.innerHTML = htmlEntitiesEncodeCharRegex(str, /[<>]/g);
	return div.firstChild.nodeValue;
}

export default {
	encode: encodeSafe,
	encodeSpecial,
	encodeCharNum,
	encodeCharRegex,
	encodeNonBasic,
	encodeHtmlAttribute,
	decode,
}
