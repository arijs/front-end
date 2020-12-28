"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadComponent;

var _component = _interopRequireDefault(require("../../isomorphic/loaders/component"));

var _ajax = _interopRequireDefault(require("./ajax"));

var _script = _interopRequireDefault(require("./script"));

var _stylesheet = _interopRequireDefault(require("./stylesheet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function loadComponent(_x) {
  return _loadComponent.apply(this, arguments);
}

function _loadComponent() {
  _loadComponent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opt.loaders = _objectSpread({
              html: _ajax["default"],
              js: _script["default"],
              css: _stylesheet["default"]
            }, opt.loaders);
            return _context.abrupt("return", (0, _component["default"])(opt));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadComponent.apply(this, arguments);
}