"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cookiestore = _interopRequireDefault(require("../sync/cookiestore"));

var _syncAdapter = _interopRequireDefault(require("./sync-adapter"));

var _addStoreKeyAsync = _interopRequireDefault(require("./add-store-key-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_cookiestore["default"] = ((0, _syncAdapter["default"])(_cookiestore["default"]), function () {
  throw new Error('"' + "cookiestore" + '" is read-only.');
}());
_cookiestore["default"] = ((0, _addStoreKeyAsync["default"])(_cookiestore["default"]), function () {
  throw new Error('"' + "cookiestore" + '" is read-only.');
}());
_cookiestore["default"] = ((0, _addStoreKeyAsync["default"])(_cookiestore["default"]), function () {
  throw new Error('"' + "cookiestore" + '" is read-only.');
}());
var _default = _cookiestore["default"];
exports["default"] = _default;