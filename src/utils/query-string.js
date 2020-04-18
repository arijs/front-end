
export function queryParse(param) {
	param = String(param).replace(/^\?/, '').split('&');
	var obj = {};
	var hop = Object.prototype.hasOwnProperty;
	for (var i = 0; i < param.length; i++) {
		var pi = param[i];
		if (!pi) continue;
		var eqpos = pi.indexOf('=');
		var name = window.decodeURIComponent(eqpos==-1?pi:pi.substr(0,eqpos));
		var value = window.decodeURIComponent(eqpos==-1?true:pi.substr(eqpos+1));
		if (hop.call(obj, name)) console.error('Chave duplicada na query string', {
			name: name,
			value1: obj[name],
			value2: value,
			object: obj,
			string: param
		});
		obj[name] = value;
	}
	return obj;
};

export function queryStringify(param) {
	var arr = [];
	var hop = Object.prototype.hasOwnProperty;
	for ( var key in param ) {
		if ( hop.call(param, key) && null != param[key] ) {
			var pair = [
				window.encodeURIComponent(key),
				window.encodeURIComponent(String(param[key]))
			];
			arr.push(pair.join('='));
		}
	}
	return arr.join('&');
};

export default {
	parse: queryParse,
	stringify: queryStringify
};
