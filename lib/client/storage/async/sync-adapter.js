"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = syncAdapterAsync;

function syncAdapterAsync(api) {
  return {
    s: api.s,
    type: api.type,
    set: function set(key, val, cb, expires, path, secure) {
      try {
        api.set(key, val, expires, path, secure);
      } catch (e) {
        return cb(e);
      }

      return cb();
    },
    get: function get(key, cb) {
      var val;

      try {
        val = api.get(key);
      } catch (e) {
        return cb(e, val);
      }

      return cb(null, val);
    },
    remove: function remove(key, cb) {
      try {
        api.remove(key);
      } catch (e) {
        return cb(e);
      }

      return cb();
    },
    removeAll: function removeAll(cb) {
      try {
        api.removeAll();
      } catch (e) {
        return cb(e);
      }

      return cb();
    },
    getAll: function getAll(cb) {
      var val;

      try {
        val = api.getAll();
      } catch (e) {
        return cb(e, val);
      }

      return cb(null, val);
    }
  };
}