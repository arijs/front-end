"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = addStoreKeyAsync;

function addStoreKeyAsync(s) {
  s.key = function key(k) {
    return {
      get: function get(cb) {
        return s.get(k, cb);
      },
      set: function set(v, cb) {
        return s.set(k, v, cb);
      },
      remove: function remove(cb) {
        return s.remove(k, cb);
      }
    };
  };

  return s;
}