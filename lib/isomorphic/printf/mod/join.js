"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = printfJoin;

function printfJoin(value, params) {
  value = value instanceof Array ? value : value ? [value] : [];
  return value.join(params && params.glue || '');
}