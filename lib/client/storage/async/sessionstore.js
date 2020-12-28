"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sessionstore = _interopRequireDefault(require("../sync/sessionstore"));

var _syncAdapter = _interopRequireDefault(require("./sync-adapter"));

var _addStoreKeyAsync = _interopRequireDefault(require("./add-store-key-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_sessionstore["default"] = ((0, _syncAdapter["default"])(_sessionstore["default"]), function () {
  throw new Error('"' + "sessionstore" + '" is read-only.');
}());
_sessionstore["default"] = ((0, _addStoreKeyAsync["default"])(_sessionstore["default"]), function () {
  throw new Error('"' + "sessionstore" + '" is read-only.');
}());
_sessionstore["default"] = ((0, _addStoreKeyAsync["default"])(_sessionstore["default"]), function () {
  throw new Error('"' + "sessionstore" + '" is read-only.');
}());
var _default = _sessionstore["default"];
exports["default"] = _default;