import each from '../../utils/for-each';

function errorNotFound(key, name, list) {
	// @TODO print dict names on error
	var e = new Error(
		(name?name+': ':'')+
		'Key '+JSON.stringify(key)+
		' not found on '+list.length+
		' objects'
	);
	e.info = {key, name, list};
	return e;
}

function onErrorDefault(err) {
	throw err;
}

export default function dictionaryDynamicList(list, name, onError = onErrorDefault) {
	return {
		name,
		find,
		has,
		get,
		set,
		listenerAdd,
		listenerRemove,
	};
	function find(key) {
		var found;
		each(list, function(dict) {
			if (dict.has(key)) {
				found = dict;
				return this._break;
			}
		});
		return found;
	}
	function apply(key, fn) {
		var found = find(key);
		if (found) return fn(found);
		return onError(errorNotFound(key, name, list));
	}
	function has(key) {
		return Boolean(find(key));
	}
	function get(key, listener) {
		apply(key, function(dict) {
			return dict.get(key, listener);
		});
	}
	function set(key, val) {
		apply(key, function(dict) {
			return dict.set(key, val);
		});
	}
	function listenerAdd(key, listener) {
		apply(key, function(dict) {
			return dict.listenerAdd(key, listener);
		});
	}
	function listenerRemove(key, listener) {
		apply(key, function(dict) {
			return dict.listenerRemove(key, listener);
		});
	}
}
