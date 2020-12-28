"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadScriptQueue;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function processItemDefault(x) {
  return x;
}

function processResultDefault(x) {// nop
}

function addJsContext(item, jsContext, jsOnError) {
  return _objectSpread({
    jsContext: jsContext,
    jsOnError: jsOnError
  }, 'string' === typeof item ? {
    url: item
  } : item);
}

function loadScriptQueue(_x) {
  return _loadScriptQueue.apply(this, arguments);
}
/*
import loadScriptDefault from './script';
	loadScript = loadScript instanceof Function
		? loadScript
		: loadScriptDefault;
*/


function _loadScriptQueue() {
  _loadScriptQueue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var queue, jsContext, jsOnError, processItem, processResult, loadScript, next, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            queue = _ref.queue, jsContext = _ref.jsContext, jsOnError = _ref.jsOnError, processItem = _ref.processItem, processResult = _ref.processResult, loadScript = _ref.loadScript;
            processItem = processItem instanceof Function ? processItem : processItemDefault;
            processResult = processResult instanceof Function ? processResult : processResultDefault;

          case 3:
            if (!queue.length) {
              _context.next = 14;
              break;
            }

            next = queue.shift(); // console.log('  ~ load script queue', typeof next, queue.length, 'remaining');

            if (next) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("continue", 3);

          case 7:
            next = processItem(addJsContext(next, jsContext, jsOnError));
            _context.next = 10;
            return loadScript(next);

          case 10:
            res = _context.sent;
            processResult(next, res);
            _context.next = 3;
            break;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadScriptQueue.apply(this, arguments);
}