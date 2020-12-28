"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexGuidToIntArray = hexGuidToIntArray;
exports.intArrayToHexGuid = intArrayToHexGuid;
exports.hexGuidToBase64 = hexGuidToBase64;
exports.base64ToHexGuid = base64ToHexGuid;

var _stringEncoding = require("./string-encoding");

var reNonHex = /[^0-9a-f]/gi;

function hexGuidToIntArray(guid) {
  var gd = String(guid).replace(reNonHex, '');
  if (gd.length !== 32) throw new Error('Invalid GUID: ' + String(guid).substr(0, 48));
  guid = new Uint8Array(16);

  for (var i = 0; i < 16; i++) {
    guid[i] = parseInt(gd.substr(i * 2, 2), 16);
  }

  return guid;
}

function intArrayToHexGuid(arr) {
  if (arr.length !== 16) throw new Error('IntArray is not a valid GUID: ' + arr.length);
  var str = '';
  var z0 = '00';

  for (var i = 0; i < 16; i++) {
    str += i == 4 || i == 6 || i == 8 || i == 10 ? '-' : '';
    str += z0.concat(Number(arr[i]).toString(16)).substr(-2, 2);
  }

  return str;
}

function hexGuidToBase64(guid) {
  return btoa((0, _stringEncoding.intArrayToString)(hexGuidToIntArray(guid)));
}

function base64ToHexGuid(b64) {
  return intArrayToHexGuid((0, _stringEncoding.stringToUint8Array)(atob(b64)));
}