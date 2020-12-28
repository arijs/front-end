"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayFrom = arrayFrom;
exports.arrayConcat = arrayConcat;
exports.isCollection = isCollection;

function arrayFrom(val) {
  var slice = Array.prototype.slice;

  switch (true) {
    case val instanceof Array:
      return val;

    case void 0 == val:
      return [];

    case isCollection(val):
      return slice.call(val);

    default:
      return [val];
  }
}

function arrayConcat(val) {
  switch (true) {
    case val instanceof Array:
      return val;

    case void 0 == val:
      return [];

    default:
      return [val];
  }
}

function isCollection(obj) {
  var propEnum = Object.prototype.propertyIsEnumerable;
  var len, intLen;
  return obj && // [Object NodeList].hasOwnProperty('length') === false
  'length' in obj && !propEnum.call(obj, 'length') && (len = obj.length, intLen = parseInt(len), intLen === len && intLen >= 0);
}