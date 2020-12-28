"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeSpecial = encodeSpecial;
exports.encodeCharNum = encodeCharNum;
exports.encodeCharRegex = encodeCharRegex;
exports.encodeSafe = encodeSafe;
exports.encodeNonBasic = encodeNonBasic;
exports.encodeHtmlAttribute = encodeHtmlAttribute;
exports.decode = decode;
exports["default"] = void 0;

function encodeSpecial(str) {
  var text = document.createTextNode(str);
  var div = document.createElement('div');
  div.appendChild(text);
  return div.innerHTML;
}

function encodeCharNum(chr, hex) {
  chr = String(chr).charCodeAt(0);
  chr = (hex ? 'x' : '') + Number(chr).toString(hex ? 16 : 10);
  return '&#' + chr + ';';
}

function encodeCharRegex(str, reg, hex) {
  return String(str).replace(reg, function (c) {
    return encodeCharNum(c, hex);
  });
}

function encodeSafe(str, hex) {
  return encodeCharRegex(str, /\W/g, hex);
}

function encodeNonBasic(str, hex) {
  return encodeCharRegex(str, /[^\w:;.,~^`´!?°ªº@#$%*()\[\]{}\/\\=+-]/g);
}

function encodeHtmlAttribute(str, hex) {
  return encodeCharRegex(str, /[\s'"=&<>]/g, hex);
}

function decode(str) {
  var div = document.createElement('div');
  div.innerHTML = encodeCharRegex(str, /[<>]/g);
  return div.firstChild.nodeValue;
}

var _default = {
  encode: encodeSafe,
  encodeSpecial: encodeSpecial,
  encodeCharNum: encodeCharNum,
  encodeCharRegex: encodeCharRegex,
  encodeNonBasic: encodeNonBasic,
  encodeHtmlAttribute: encodeHtmlAttribute,
  decode: decode
};
exports["default"] = _default;