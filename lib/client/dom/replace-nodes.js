"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = replaceNodes;

var _forEach = _interopRequireDefault(require("../../isomorphic/utils/for-each"));

var _collection = require("../../isomorphic/utils/collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function replaceNodes(remove, insert, parent) {
  remove = (0, _collection.arrayConcat)(remove);
  insert = (0, _collection.arrayConcat)(insert);
  var first = remove[0];
  (0, _forEach["default"])(insert, function (item) {
    return parent.insertBefore(item, first);
  });
  (0, _forEach["default"])(remove, function (item) {
    return parent.removeChild(item);
  });
}