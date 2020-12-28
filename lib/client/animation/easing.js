"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inter = inter;
exports.interMod = interMod;
exports.linear = linear;
exports.sin = sin;
exports.quad = quad;
exports.cubic = cubic;
exports.quart = quart;
exports.quint = quint;
exports.modIn = modIn;
exports.modOut = modOut;
exports.modTwice = modTwice;
exports.modInOut = modInOut;
exports.modInOut2 = modInOut2;
exports.modOutIn = modOutIn;
exports.modOutIn2 = modOutIn2;
exports.fnMod = fnMod;
exports.fnInter = fnInter;

/**
 * @param t
 * Current time, starting at zero.
 * @param b
 * Starting value to ease.
 * @param c
 * Ending value.
 * @param d
 * Duration in time.
 */
function inter(t, b, c, d, fn) {
  return fn(t / d) * (c - b) + b;
}

function interMod(t, b, c, d, ease, mod) {
  return mod(t / d, ease) * (c - b) + b;
}

function linear(x) {
  return x;
}

function sin(x) {
  return 1 - Math.sin((1 - x) * 0.5 * Math.PI);
}

function quad(x) {
  return x * x;
}

function cubic(x) {
  return x * x * x;
}

function quart(x) {
  return x * x * x * x;
}

function quint(x) {
  return x * x * x * x * x;
}

function modIn(t, fn) {
  return fn(t);
}

function modOut(t, fn) {
  return 1 - fn(1 - t);
}

function modTwice(t, fn) {
  return fn(t * 2) * 0.5;
}

function modInOut(t, fn) {
  return t < 0.5 ? modTwice(t, fn) : modOut(t, fnMod(fn, modTwice));
}

function modInOut2(t, fn) {
  return t < 0.5 ? modTwice(t, fn[0]) : modOut(t, fnMod(fn[1], modTwice));
}

function modOutIn(t, fn) {
  return t < 0.5 ? modTwice(t, fnMod(fn, modOut)) : modTwice(t - 0.5, fn) + 0.5;
}

function modOutIn2(t, fn) {
  return t < 0.5 ? modTwice(t, fnMod(fn[0], modOut)) : modTwice(t - 0.5, fn[1]) + 0.5;
}

function fnMod(fn, mod) {
  return function (t) {
    return mod(t, fn);
  };
}

function fnInter(fn) {
  return function (t, b, c, d) {
    return inter(t, b, c, d, fn);
  };
}