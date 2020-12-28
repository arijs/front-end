"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  set: function set(key, val) {
    this.s.setItem(key, JSON.stringify(val));
    return val;
  },
  get: function get(key) {
    var value = this.s.getItem(key);

    if (typeof value != 'string') {
      return undefined;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return value || undefined;
    }
  },
  remove: function remove(key) {
    this.s.removeItem(key);
  },
  removeAll: function removeAll() {
    this.s.clear();
  },
  getAll: function getAll() {
    var ret = {};

    for (var i = 0; i < this.s.length; i++) {
      var key = this.s.key(i);
      ret[key] = this.get(key);
    }

    return ret;
  }
};
exports["default"] = _default;