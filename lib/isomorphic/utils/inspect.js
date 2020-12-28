"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspectVal = inspectVal;
exports.inspectObj = inspectObj;
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function inspectVal(obj, maxLen) {
  var toStr = Object.prototype.toString;
  var str = obj instanceof Object ? toStr.call(obj) : obj && 'object' === _typeof(obj) ? "{".concat(Object.keys(obj).join(), "}") : String(obj);
  return maxLen && maxLen > 0 ? str.substr(0, maxLen) : str;
}

function inspectObj(obj, level, maxLen) {
  level = +level || 0;

  if ('object' === _typeof(obj) && level > 0) {
    var map = {};

    for (var k in obj) {
      map[k] = inspectObj(obj[k], level - 1, maxLen);
    }

    return map;
  } else {
    return inspectVal(obj, maxLen);
  }
}

var _default = inspectObj;
exports["default"] = _default;