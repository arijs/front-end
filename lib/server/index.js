"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = exports.state = exports.printf = exports.loaders = exports.date = exports.utils = void 0;

var utilsIsomorphic = _interopRequireDefault(require("../isomorphic/utils/index"));

var utilsServer = _interopRequireDefault(require("./utils/index"));

var _date = _interopRequireDefault(require("../isomorphic/date/index"));

exports.date = _date;

var _loaders = _interopRequireDefault(require("./loaders/index"));

exports.loaders = _loaders;

var _printf = _interopRequireDefault(require("../isomorphic/printf/index"));

exports.printf = _printf;

var _state = _interopRequireDefault(require("../isomorphic/state/index"));

exports.state = _state;

var _string = _interopRequireDefault(require("../isomorphic/string/index"));

exports.string = _string;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var utils = _objectSpread(_objectSpread({}, utilsIsomorphic), utilsServer);

exports.utils = utils;