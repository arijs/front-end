"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _localstore = _interopRequireDefault(require("../sync/localstore"));

var _syncAdapter = _interopRequireDefault(require("./sync-adapter"));

var _addStoreKeyAsync = _interopRequireDefault(require("./add-store-key-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_localstore["default"] = ((0, _syncAdapter["default"])(_localstore["default"]), function () {
  throw new Error('"' + "localstore" + '" is read-only.');
}());
_localstore["default"] = ((0, _addStoreKeyAsync["default"])(_localstore["default"]), function () {
  throw new Error('"' + "localstore" + '" is read-only.');
}());
_localstore["default"] = ((0, _addStoreKeyAsync["default"])(_localstore["default"]), function () {
  throw new Error('"' + "localstore" + '" is read-only.');
}());
var _default = _localstore["default"];
exports["default"] = _default;