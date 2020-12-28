"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printf = printf;
Object.defineProperty(exports, "printfParse", {
  enumerable: true,
  get: function get() {
    return _parse["default"];
  }
});
Object.defineProperty(exports, "printfFill", {
  enumerable: true,
  get: function get() {
    return _fill["default"];
  }
});
exports["default"] = void 0;

var _parse = _interopRequireDefault(require("./parse"));

var _fill = _interopRequireDefault(require("./fill"));

var _dictionaryStatic = _interopRequireDefault(require("../state/dictionary-static"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function printf(str, vars, mods, cbError, debug) {
  if (debug) debugger;
  return (0, _fill["default"])((0, _parse["default"])(str), (0, _dictionaryStatic["default"])(vars), (0, _dictionaryStatic["default"])(mods), cbError);
}

var _default = printf;
exports["default"] = _default;