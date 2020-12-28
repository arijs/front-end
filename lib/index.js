"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = exports.isomorphic = exports.client = void 0;

var _client = _interopRequireDefault(require("./client/index"));

exports.client = _client;

var _isomorphic = _interopRequireDefault(require("./isomorphic/index"));

exports.isomorphic = _isomorphic;

var _server = _interopRequireDefault(require("./server/index"));

exports.server = _server;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }