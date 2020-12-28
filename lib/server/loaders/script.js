"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadScript;

var _ajax = _interopRequireDefault(require("./ajax"));

var _evalContext = _interopRequireDefault(require("../../isomorphic/utils/eval-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function loadScript(_x) {
  return _loadScript.apply(this, arguments);
}

function _loadScript() {
  _loadScript = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt) {
    var _opt, jsContext, jsOnError, processData, data, onScriptError;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            onScriptError = function _onScriptError(error, values) {
              jsOnError instanceof Function && jsOnError(error, opt, values);
            };

            if ('string' === typeof opt) opt = {
              url: opt
            };
            _opt = opt, jsContext = _opt.jsContext, jsOnError = _opt.jsOnError, processData = _opt.processData; // console.log(' +  load js', opt.url, jsContext);

            _context.next = 5;
            return (0, _ajax["default"])(opt);

          case 5:
            data = _context.sent;

            if (processData instanceof Function) {
              data = processData(data, opt);
            }

            return _context.abrupt("return", (0, _evalContext["default"])(data, jsContext, onScriptError).run());

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadScript.apply(this, arguments);
}