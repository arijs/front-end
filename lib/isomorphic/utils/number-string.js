"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberParse = numberParse;
exports.numberFormat = numberFormat;
exports.numberFormatStr = numberFormatStr;
exports.numberFormatArr = numberFormatArr;

function numberParse(n) {
  return parseFloat(n.replace(/\./g, '').replace(/,/g, '.'));
}

function numberFormat(n, dlen, dsep, gsep, glen) {
  if (isNaN(dlen)) {
    n = Number(n).toString().split('.');
  } else {
    n = Number(n).toFixed(dlen || 0).split('.');
  }

  return numberFormatArr(n, dlen, dsep, gsep, glen);
}

function numberFormatStr(n, dlen, dsep, gsep, glen) {
  var sign = n.match(/[+-]/);
  sign = sign && sign[0] || '';
  n = n.replace(/[^0-9]/g, '');
  n = n.replace(/^0+/, '');
  var nlen = n.length;

  while (nlen <= dlen) {
    n = '0' + n;
    nlen++;
  }

  var c = nlen - dlen;
  n = [sign + n.substr(0, c), n.substr(c, dlen)];
  return numberFormatArr(n, dlen, dsep, gsep, glen);
}

function numberFormatArr(n, dlen, dsep, gsep, glen) {
  if (!glen) glen = 3;
  if (null == dsep) dsep = ',';
  if (null == gsep) gsep = '.';
  var groups = [];
  var i = n[0];
  var sign = i.match(/[+-]/);
  sign = sign && sign[0] || '';
  i = i.replace(/[^0-9]/g, '');
  var len = i.length;

  while (len > glen) {
    len -= glen;
    groups.unshift(i.substr(len, glen));
    i = i.substr(0, len);
  }

  groups.unshift(i);
  n[0] = sign + groups.join(gsep);
  return (isNaN(dlen) ? n[1] : dlen) ? n.join(dsep) : n[0];
}