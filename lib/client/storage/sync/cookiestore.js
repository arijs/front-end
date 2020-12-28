"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _addStoreKey = _interopRequireDefault(require("./add-store-key"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = (0, _addStoreKey["default"])({
  s: document.cookie,
  type: 'cookie',
  set: function set(name, value, expires, path, secure) {
    if (value !== undefined && _typeof(value) === "object") var valueToUse = JSON.stringify(value);else var valueToUse = encodeURIComponent(value);
    document.cookie = name + "=" + valueToUse + (expires ? "; expires=" + new Date(expires).toUTCString() : '') + "; path=" + (path || '/') + (secure ? "; secure" : '');
  },
  get: function get(name) {
    var cookies = this.getAllRawOrProcessed(false);
    if (cookies.hasOwnProperty(name)) return this.processValue(cookies[name]);else return undefined;
  },
  processValue: function processValue(value) {
    if (value.substring(0, 1) == "{") {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }

    if (value == "undefined") return undefined;
    return decodeURIComponent(value);
  },
  getAllRawOrProcessed: function getAllRawOrProcessed(process) {
    //process - process value or return raw value
    var cookies = document.cookie.split('; '),
        s = {};
    if (cookies.length === 1 && cookies[0] === '') return s;

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split('=');
      if (process) s[cookie[0]] = this.processValue(cookie[1]);else s[cookie[0]] = cookie[1];
    }

    return s;
  },
  getAll: function getAll() {
    return this.getAllRawOrProcessed(true);
  },
  remove: function remove(name) {
    this.set(name, "", -1);
  },
  removeAll: function removeAll() {
    var cookies = this.getAll();

    for (var i in cookies) {
      this.remove(i);
    }

    return this.getAll();
  }
});

exports["default"] = _default;