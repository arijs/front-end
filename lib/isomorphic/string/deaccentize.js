"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deaccentize = deaccentize;
exports["default"] = exports.all = exports.advanced = exports.basic = void 0;

function setChars(chars, objList) {
  var ollen = objList && objList.length;
  if (!ollen) return;

  for (var k in chars) {
    if (chars.hasOwnProperty(k)) {
      var list = chars[k];

      for (var i = 0, ii = list.length; i < ii; i++) {
        for (var j = 0; j < ollen; j++) {
          objList[j][list[i]] = k;
        }
      }
    }
  }
}

var charBasic = {
  A: 'ÀÁÂÃÄÅ',
  a: 'àáâãäå',
  C: 'Ç',
  c: 'ç',
  E: 'ÈÉÊË',
  e: 'èéêë',
  I: 'ÌÍÎÏ',
  i: 'ìíîï',
  N: 'Ñ',
  n: 'ñ',
  O: 'ÒÓÔÕÖØ',
  o: 'òóôõöø',
  U: 'ÙÚÛÜ',
  u: 'ùúûü',
  Y: 'ÝŸ',
  y: 'ýÿ'
};
var charAdvanced = {
  A: 'ĀĂĄ',
  a: 'āăą',
  C: 'ĆĈĊČ',
  c: 'ćĉċč',
  D: 'ĎĐ',
  d: 'ďđ',
  E: 'ĒĔĖĘĚ',
  e: 'ēĕėęě',
  G: 'ĜĞĠĢ',
  g: 'ĝğġģ',
  H: 'ĤĦ',
  h: 'ĥħ',
  I: 'ĨĪĬĮİ',
  i: 'ĩīĭįı',
  J: 'Ĵ',
  j: 'ĵ',
  K: 'Ķ',
  k: 'ķ',
  L: 'ĹĻĽĿŁ',
  l: 'ĺļľŀł',
  N: 'ŃŅŇ',
  n: 'ńņň',
  O: 'ŌŎŐ',
  o: 'ōŏő',
  R: 'ŔŖŘ',
  r: 'ŕŗř',
  S: 'ŚŜŞŠ',
  s: 'śŝşš',
  T: 'ŢŤŦ',
  t: 'ţťŧ',
  U: 'ŨŪŬŮŰŲ',
  u: 'ũūŭůűų',
  W: 'Ŵ',
  w: 'ŵ',
  Y: 'Ŷ',
  y: 'ŷ',
  Z: 'ŹŻŽ',
  z: 'źżž'
};
var basic = {};
exports.basic = basic;
var advanced = {};
exports.advanced = advanced;
var all = {};
exports.all = all;
setChars(charBasic, [basic, all]);
setChars(charAdvanced, [advanced, all]);

function deaccentize(s, charMap) {
  var t = '';
  charMap || (charMap = all);

  for (var i = 0, ii = s.length; i < ii; i++) {
    var sc = s[i],
        tc = charMap[sc];
    t += tc || sc;
  }

  return t;
}

var _default = deaccentize;
exports["default"] = _default;