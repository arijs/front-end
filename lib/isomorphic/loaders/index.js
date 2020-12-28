"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "scriptQueue", {
  enumerable: true,
  get: function get() {
    return _scriptQueue["default"];
  }
});
Object.defineProperty(exports, "component", {
  enumerable: true,
  get: function get() {
    return _component["default"];
  }
});
Object.defineProperty(exports, "prefixMatcher", {
  enumerable: true,
  get: function get() {
    return _compPrefix["default"];
  }
});
Object.defineProperty(exports, "initVueLoaders", {
  enumerable: true,
  get: function get() {
    return _initVueLoaders["default"];
  }
});

var _scriptQueue = _interopRequireDefault(require("./script-queue"));

var _component = _interopRequireDefault(require("./component"));

var _compPrefix = _interopRequireDefault(require("./comp-prefix"));

var _initVueLoaders = _interopRequireDefault(require("./init-vue-loaders"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }