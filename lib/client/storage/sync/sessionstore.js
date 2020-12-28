"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _browserstore = _interopRequireDefault(require("./browserstore"));

var _addStoreKey = _interopRequireDefault(require("./add-store-key"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _addStoreKey["default"])({
  s: window.sessionStorage,
  type: 'sessionStorage',
  set: _browserstore["default"].set,
  get: _browserstore["default"].get,
  remove: _browserstore["default"].remove,
  removeAll: _browserstore["default"].removeAll,
  getAll: _browserstore["default"].getAll
});

exports["default"] = _default;