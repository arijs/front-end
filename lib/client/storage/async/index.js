"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _localstore = _interopRequireDefault(require("./localstore"));

var _sessionstore = _interopRequireDefault(require("./sessionstore"));

var _cookiestore = _interopRequireDefault(require("./cookiestore"));

var _capacitor = _interopRequireDefault(require("./capacitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var store;

if (_capacitor["default"].s) {
  store = _capacitor["default"];
} else {
  store = _localstore["default"];
}

store.capacitor = _capacitor["default"];
store.local = _localstore["default"];
store.session = _sessionstore["default"];
store.cookie = _cookiestore["default"];
var _default = store;
exports["default"] = _default;