"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dictionaryStatic = dictionaryStatic;
exports["default"] = void 0;

function dictionaryStatic(dict) {
  var hop = Object.prototype.hasOwnProperty;
  return {
    has: function has(key) {
      return dict ? hop.call(dict, key) : false;
    },
    get: function get(key) {
      return dict ? dict[key] : void 0;
    }
  };
}

var _default = dictionaryStatic;
exports["default"] = _default;