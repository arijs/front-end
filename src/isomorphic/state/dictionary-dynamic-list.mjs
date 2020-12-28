import each from '../utils/for-each.mjs';

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
	return console.warn(err);
}

function DictionaryDynamicList(list, name, onError) {
	this._list = list;
	this.name = name;
	if (onError) this.onError = onError;
}

DictionaryDynamicList.prototype = {
	constuctor: DictionaryDynamicList,
	_list: null,
	name: null,
	onError: onErrorDefault,
	find,
	apply,
	has,
	get,
	set,
	listenerAdd,
	listenerRemove,
};
function find(key) {
	return each(this._list, function(dict) {
		if (dict.has(key)) {
			this.result = dict;
			return this._break;
		}
	});
}
function apply(key, fn, onKeyError) {
	var found = this.find(key);
	if (found) return fn.call(this, found);
	if (!(onKeyError instanceof Function)) onKeyError = this.onError;
	return onKeyError.call(this, errorNotFound(key, this.name, this._list));
}
function has(key) {
	return Boolean(this.find(key));
}
function get(key, listener, onKeyError) {
	return this.apply(key, function(dict) {
		return dict.get(key, listener);
	}, onKeyError);
}
function set(key, val, onKeyError) {
	return this.apply(key, function(dict) {
		return dict.set(key, val);
	}, onKeyError);
}
function listenerAdd(key, listener, onKeyError) {
	return this.apply(key, function(dict) {
		return dict.listenerAdd(key, listener);
	}, onKeyError);
}
function listenerRemove(key, listener, onKeyError) {
	return this.apply(key, function(dict) {
		return dict.listenerRemove(key, listener);
	}, onKeyError);
}

export default DictionaryDynamicList;
