"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.surrogateEncode = surrogateEncode;
exports.surrogateDecode = surrogateDecode;
var reSurrogates = /[\uD800-\uDBFF\uDC00-\uDFFF]/g;
var reSurrDecode = /%(d[89a-f])%([0-9a-f]{2})/gi;

function surrogateEncode(s) {
  return String(s).replace(reSurrogates, function (c) {
    var d = '';
    c = c.charCodeAt(0).toString(16);

    while (c.length % 2) {
      c = '0' + c;
    }

    while (c.length) {
      d += '%' + c.substr(0, 2);
      c = c.substr(2);
    }

    return d;
  });
}

function surrogateDecode(s) {
  return String(s).replace(reSurrDecode, function (d, c1, c2) {
    return String.fromCharCode(parseInt(c1 + '00', 16) + parseInt(c2, 16));
  });
}