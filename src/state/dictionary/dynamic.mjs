import callListeners from '../../utils/listeners';

export default function dictionaryDynamic(dict, oldLimit, name) {
	var hop = Object.prototype.hasOwnProperty;
	var mapListeners = {};
	var mapNextTick = {};
	var nextTickListeners = [];
	if (!oldLimit) oldLimit = 0;
	return {
		name,
		has,
		get,
		set,
		listenerAdd,
		listenerRemove,
		nextTick
	};
	function has(key) {
		return dict ? hop.call(dict, key) : false;
	}
	function get(key, listener) {
		if (listener) listenerAdd(key, listener);
		return dict ? dict[key] : void 0;
	}
	function set(key, val) {
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
			nextTick(keyNext.listener);
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
		var mapKey = mapListeners[key];
		if (!mapKey) mapListeners[key] = mapKey = [];
		mapKey.push(listener);
	}
	function listenerRemove(key, listener) {
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
		if (!nextTickListeners.length) setTimeout(function() {
			callListeners(nextTickListeners);
			nextTickListeners = [];
		}, 0);
		nextTickListeners.push(listener);
	}
}
