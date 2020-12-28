"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.intArrayToString = intArrayToString;
exports.stringToUint8Array = stringToUint8Array;
exports.stringToUint16Array = stringToUint16Array;
exports.setCharCodesIntoArray = setCharCodesIntoArray;
exports.stringToBinary = stringToBinary;
exports.binaryToString = binaryToString;

function intArrayToString(bytes) {
  var str = '';
  var c = bytes.length;

  for (var i = 0; i < c; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  return str;
}

function stringToUint8Array(string) {
  var bytes = new Uint8Array(string.length);
  return setCharCodesIntoArray(string, bytes);
}

function stringToUint16Array(string) {
  var codeUnits = new Uint16Array(string.length);
  return setCharCodesIntoArray(string, codeUnits);
}

function setCharCodesIntoArray(string, array) {
  var c = array.length;

  for (var i = 0; i < c; i++) {
    array[i] = string.charCodeAt(i);
  }

  return array;
}

function stringToBinary(string) {
  var codeUnits = stringToUint16Array(string);
  var bytes = new Uint8Array(codeUnits.buffer);
  return intArrayToString(bytes);
}

function binaryToString(binary) {
  var bytes = stringToUint8Array(binary);
  var chars = new Uint16Array(bytes.buffer);
  return intArrayToString(chars);
}