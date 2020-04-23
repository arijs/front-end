import {callListeners} from '../../utils/listeners';

var hop = Object.prototype.hasOwnProperty;

function DictionaryDynamic(dict, name, oldLimit) {
	if (!oldLimit) oldLimit = 0;
	this._name = name;
	this._dict = dict;
	this._oldLimit = oldLimit;
	this._mapListeners = {};
	this._mapNextTick = {};
	this._nextTickListeners = [];
}
DictionaryDynamic.prototype = {
	constructor: DictionaryDynamic,
	_name: null,
	_dict: null,
	_oldLimit: 0,
	_mapListeners: null,
	_mapNextTick: null,
	_nextTickListeners: null,
	has,
	get,
	set,
	listenerAdd,
	listenerRemove,
	nextTick,
};
function has(key) {
	var dict = this._dict;
	return dict ? hop.call(dict, key) : false;
}
function get(key, listener) {
	var dict = this._dict;
	if (listener) this.listenerAdd(key, listener);
	return dict ? dict[key] : void 0;
}
function set(key, val) {
	var dict = this._dict;
	var mapNextTick = this._mapNextTick;
	var mapListeners = this._mapListeners;
	var old = dict[key];
	var keyNext = mapNextTick[key];
	if (!keyNext) {
		mapNextTick[key] = keyNext = {
			val: void 0,
			oldFirst: old,
			oldLast: void 0,
			oldAll: [old],
			listener: function() {
				mapNextTick[key] = void 0;
				callListeners(mapListeners[key], keyNext, keyNext.val, keyNext.oldFirst);
			}
		};
		this.nextTick(keyNext.listener);
	}
	if (old !== keyNext.oldLast) {
		var oldAll = keyNext.oldAll;
		oldAll.push(old);
		var oac = oldAll.length;
		if (oac > oldLimit) {
			oldAll.splice(0, oac - oldLimit);
		}
	}
	keyNext.oldLast = old;
	keyNext.val = val;
	dict[key] = val;
}
function listenerAdd(key, listener) {
	var mapListeners = this._mapListeners;
	var mapKey = mapListeners[key];
	if (!mapKey) mapListeners[key] = mapKey = [];
	mapKey.push(listener);
}
function listenerRemove(key, listener) {
	var mapListeners = this._mapListeners;
	if (listener) {
		var mapKey = mapListeners[key];
		var c = mapKey && mapKey.length || 0;
		for (var i = 0; i < c; i++) {
			if (mapKey[i] === listener) {
				mapKey.splice(i, 1), i--, c--;
			}
		}
		if (!c) mapListeners[key] = void 0;
	} else {
		mapListeners[key] = void 0;
	}
}
function nextTick(listener) {
	var nextTickListeners = this._nextTickListeners;
	if (!nextTickListeners.length) setTimeout(function() {
		callListeners(nextTickListeners);
		nextTickListeners = [];
	}, 0);
	nextTickListeners.push(listener);
}

export default DictionaryDynamic;
