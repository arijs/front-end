"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadAjax;

var _promises = require("fs/promises");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function loadAjax(_x) {
  return _loadAjax.apply(this, arguments);
}

function _loadAjax() {
  _loadAjax = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ('string' === typeof opt) opt = {
              url: opt
            };
            _context.next = 3;
            return (0, _promises.readFile)(opt.url, {
              encoding: opt.encoding || 'utf8'
            });

          case 3:
            data = _context.sent;

            if (opt.json) {
              data = JSON.parse(data);
            }

            return _context.abrupt("return", data);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadAjax.apply(this, arguments);
}