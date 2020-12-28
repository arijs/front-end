"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryParse = queryParse;
exports.queryStringify = queryStringify;
exports["default"] = void 0;

function queryParse(param) {
  param = String(param).replace(/^\?/, '').split('&');
  var obj = {};
  var hop = Object.prototype.hasOwnProperty;

  for (var i = 0; i < param.length; i++) {
    var pi = param[i];
    if (!pi) continue;
    var eqpos = pi.indexOf('=');
    var name = decodeURIComponent(eqpos == -1 ? pi : pi.substr(0, eqpos));
    var value = decodeURIComponent(eqpos == -1 ? true : pi.substr(eqpos + 1));
    if (hop.call(obj, name)) console.error('Chave duplicada na query string', {
      name: name,
      value1: obj[name],
      value2: value,
      object: obj,
      string: param
    });
    obj[name] = value;
  }

  return obj;
}

;

function queryStringify(param) {
  var arr = [];
  var hop = Object.prototype.hasOwnProperty;

  for (var key in param) {
    if (hop.call(param, key) && null != param[key]) {
      var pair = [encodeURIComponent(key), encodeURIComponent(String(param[key]))];
      arr.push(pair.join('='));
    }
  }

  return arr.join('&');
}

;
var _default = {
  parse: queryParse,
  stringify: queryStringify
};
exports["default"] = _default;