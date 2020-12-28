"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = forEach;

function forEach(list, cb, result) {
  var _break = 1 << 0;

  var _remove = 1 << 1;

  if (result instanceof Function && !(cb instanceof Function)) {
    result = [result, cb];
    cb = result[0];
    result = result[1];
  }

  var ctx = {
    _break: _break,
    _remove: _remove,
    result: result,
    count: list.length,
    i: 0
  };
  var ret;

  for (; ctx.i < ctx.count; ctx.i++) {
    ret = cb.call(ctx, list[ctx.i], ctx.i, list);

    if (_remove & ret) {
      list.splice(ctx.i, 1);
      ctx.i--;
      ctx.count--;
    }

    if (_break & ret) {
      break;
    }
  }

  return ctx.result;
}