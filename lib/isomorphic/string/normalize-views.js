"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getViews;

var _deaccentize = _interopRequireDefault(require("./deaccentize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getViews(raw) {
  var trim = String(raw).replace(reSpaces, '');
  var lower = trim.toLowerCase();
  var noacc = (0, _deaccentize["default"])(lower);
  return {
    raw: raw,
    trim: trim,
    lower: lower,
    noacc: noacc
  };
}