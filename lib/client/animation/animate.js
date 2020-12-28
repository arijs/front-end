"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polyfillAnimationFrame = polyfillAnimationFrame;
exports["default"] = animate;

var _easing = require("./easing");

function polyfillAnimationFrame(callback) {
  window.setTimeout(callback, 40); // 1000 / 25
}

function animate(from, to, time, ease, mod, cb) {
  var raf = window.requestAnimationFrame || polyfillAnimationFrame;
  ease || (ease = _easing.linear);
  mod || (mod = _easing.modIn);
  var start = new Date().getTime();

  var timer = function timer() {
    var pos = new Date().getTime() - start;
    var posMin = Math.min(time, pos);
    var eased = (0, _easing.interMod)(posMin, from, to, time, ease, mod);
    if (cb(eased, pos)) return;
    if (posMin !== time) raf(timer);
  };

  raf(timer);
}

;