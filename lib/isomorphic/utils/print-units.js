"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mmPerPoints = exports.pointsPerMm = exports.inchesPerPoint = exports.inchesPerMm = exports.pointsPerInch = exports.mmPerInch = void 0;
var mmPerInch = 25.4;
exports.mmPerInch = mmPerInch;
var pointsPerInch = 72;
exports.pointsPerInch = pointsPerInch;
var inchesPerMm = 1 / mmPerInch;
exports.inchesPerMm = inchesPerMm;
var inchesPerPoint = 1 / pointsPerInch;
exports.inchesPerPoint = inchesPerPoint;
var pointsPerMm = pointsPerInch / mmPerInch;
exports.pointsPerMm = pointsPerMm;
var mmPerPoints = mmPerInch / pointsPerInch;
exports.mmPerPoints = mmPerPoints;