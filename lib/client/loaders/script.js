"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadScript;

function loadScript(_ref) {
  var url = _ref.url,
      cb = _ref.cb,
      timeout = _ref.timeout,
      cbLog = _ref.cbLog;
  var script = document.createElement('script');
  var head = document.getElementsByTagName('head')[0];
  var done = false;
  script.addEventListener('load', function () {
    if (done) {
      if (cbLog) cbLog('load script too late', url);
      return;
    }

    done = true;
    cb();
  });
  script.addEventListener('error', function (err) {
    if (done) {
      if (cbLog) cbLog('error script too late', url, err);
      return;
    }

    done = true;
    cb(err);
  });
  if (timeout == null) timeout = 30000;

  if (timeout > 0) {
    setTimeout(function () {
      if (done) return;
      cb(new Error('load script timeout: ' + url));
    }, timeout);
  }

  script.src = url;
  head.appendChild(script);
}