"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendCustom = extendCustom;
exports.fnExtendCustom = fnExtendCustom;
exports.fnOptionsCustom = fnOptionsCustom;
exports.fnPropertyExtend = fnPropertyExtend;
exports.propertyOverwrite = propertyOverwrite;
exports.propertyNewOnly = propertyNewOnly;
exports.propertyNewError = propertyNewError;
exports.propertyHopOnly = propertyHopOnly;
exports["default"] = exports.options = exports.extendDeepCreate = exports.extendDeepModify = exports.extendHopOnly = exports.extendNewError = exports.extendNewOnly = exports.extend = exports.propertyObjectCreate = exports.propertyObjectModify = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var hop = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

function extendCustom(method, sourceProps, target) {
  if (!(method instanceof Function)) {
    method = propertyOverwrite;
  }

  var argc = arguments.length;

  if (sourceProps && argc === 3) {
    arguments[3] = target;
    argc = 4;
  }

  for (var i = 3; i < argc; i++) {
    var source = arguments[i];
    var props = sourceProps || source;

    for (var k in props) {
      if (hop.call(source, k)) {
        method(k, target, source);
      } else if (sourceProps) {
        method(k, target, sourceProps);
      }
    }
  }

  return target;
}

function fnExtendCustom(method, sourceProps) {
  return function extend() {
    var args = slice.call(arguments);
    args.unshift(method, sourceProps);
    return extendCustom.apply(this, args);
  };
}

function fnOptionsCustom(method) {
  return function extend() {
    var args = slice.call(arguments);
    args.unshift(method);
    return extendCustom.apply(this, args);
  };
}

function fnPropertyExtend(subExtend) {
  propertyExtend.setSubExtend = setSubExtend;
  return propertyExtend;

  function setSubExtend(se) {
    subExtend = se;
  }

  function propertyExtend(key, target, source) {
    var sk = source[key];
    var tk = target[key];

    var so = sk && 'object' === _typeof(sk);

    var to = tk && 'object' === _typeof(tk);

    var spo = so ? Object.getPrototypeOf(sk) === Object.prototype : false;
    var tpo = to ? Object.getPrototypeOf(tk) === Object.prototype : false;

    if (spo && tpo) {
      subExtend(key, target, source, propertyExtend);
    } else {
      target[key] = sk;
    }
  }
}

function propertyOverwrite(key, target, source) {
  target[key] = source[key];
}

function propertyNewOnly(key, target, source) {
  if (!hop.call(target, key)) {
    target[key] = source[key];
  }
}

function propertyNewError(key, target, source) {
  if (hop.call(target, key)) {
    throw new Error('Object already contains property ' + key + ': ' + String(target[key]).substr(0, 32));
  }

  target[key] = source[key];
}

function propertyHopOnly(key, target, source) {
  if (hop.call(target, key)) {
    target[key] = source[key];
  }
}

var propertyObjectModify = fnPropertyExtend(function (key, target, source, propertyObjectModify) {
  target[key] = extendCustom(propertyObjectModify, null, target[key], source[key]);
});
exports.propertyObjectModify = propertyObjectModify;
var propertyObjectCreate = fnPropertyExtend(function (key, target, source, propertyObjectCreate) {
  target[key] = extendCustom(propertyObjectCreate, null, {}, target[key], source[key]);
});
exports.propertyObjectCreate = propertyObjectCreate;
var extend = fnExtendCustom(propertyOverwrite);
exports.extend = extend;
var extendNewOnly = fnExtendCustom(propertyNewOnly);
exports.extendNewOnly = extendNewOnly;
var extendNewError = fnExtendCustom(propertyNewError);
exports.extendNewError = extendNewError;
var extendHopOnly = fnExtendCustom(propertyHopOnly);
exports.extendHopOnly = extendHopOnly;
var extendDeepModify = fnExtendCustom(propertyObjectModify);
exports.extendDeepModify = extendDeepModify;
var extendDeepCreate = fnExtendCustom(propertyObjectCreate);
exports.extendDeepCreate = extendDeepCreate;
var options = fnOptionsCustom(propertyOverwrite);
exports.options = options;
var _default = extend;
exports["default"] = _default;