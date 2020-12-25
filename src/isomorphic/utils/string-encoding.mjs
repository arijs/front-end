
export function intArrayToString(bytes) {
	var str = '';
	var c = bytes.length;
	for (let i = 0; i < c; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return str;
}

export function stringToUint8Array(string) {
	var bytes = new Uint8Array(string.length);
	return setCharCodesIntoArray(string, bytes);
}

export function stringToUint16Array(string) {
	var codeUnits = new Uint16Array(string.length);
	return setCharCodesIntoArray(string, codeUnits);
}

export function setCharCodesIntoArray(string, array) {
	var c = array.length;
	for (let i = 0; i < c; i++) {
		array[i] = string.charCodeAt(i);
	}
	return array;
}

export function stringToBinary(string) {
	var codeUnits = stringToUint16Array(string);
	var bytes = new Uint8Array(codeUnits.buffer);
	return intArrayToString(bytes);
}

export function binaryToString(binary) {
	var bytes = stringToUint8Array(binary);
	var chars = new Uint16Array(bytes.buffer);
	return intArrayToString(chars);
}
