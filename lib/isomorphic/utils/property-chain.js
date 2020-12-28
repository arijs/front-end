"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
exports["default"] = void 0;

function get(obj, list, vDefault) {
  var c = list.length,
      i = 0;
  var hop = Object.prototype.hasOwnProperty;

  for (; i < c; i++) {
    var k = list[i];

    if (hop.call(obj, k)) {
      if (c == i + 1) {
        return obj[k];
      } else {
        obj = obj[k];
        if (!obj) return vDefault;
      }
    } else {
      return vDefault;
    }
  }

  return obj;
}

function set(obj, list, value) {
  var c = list.length - 1;
  var hop = Object.prototype.hasOwnProperty;
  var next = void 0;

  for (var i = 0; i < c; i++) {
    var k = list[i];
    if (hop.call(obj, k)) next = obj[k];

    if (!(next instanceof Object)) {
      next = obj[k] = {};
    }

    obj = next;
    next = void 0;
  }

  k = list[i];
  obj[k] = value;
  return value;
}

var _default = get;
exports["default"] = _default;