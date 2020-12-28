"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = addStoreKey;

function addStoreKey(s) {
  s.key = function key(k) {
    return {
      get: function get() {
        return s.get(k);
      },
      set: function set(v) {
        return s.set(k, v);
      },
      remove: function remove() {
        return s.remove(k);
      }
    };
  };

  return s;
}