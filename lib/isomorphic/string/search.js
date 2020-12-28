"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.levenshteinLength = levenshteinLength;
exports.getDistance = getDistance;
exports.getDistanceObject = getDistanceObject;
exports.compareDistanceObjects = compareDistanceObjects;
exports.mergeClosest = mergeClosest;
exports.testMaxDistanceObject = testMaxDistanceObject;
exports.insertClosest = insertClosest;
exports.cutClosestDistance = cutClosestDistance;
exports.search = search;
exports["default"] = void 0;

var _levenshtein = _interopRequireDefault(require("./levenshtein"));

var _normalizeViews = _interopRequireDefault(require("./normalize-views"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function levenshteinLength(a, b) {
  return {
    distance: (0, _levenshtein["default"])(a, b),
    aLength: a.length,
    bLength: b.length
  };
}

function getDistance(a, b) {
  return {
    raw: levenshteinLength(a.raw, b.raw),
    trim: levenshteinLength(a.trim, b.trim),
    lower: levenshteinLength(a.lower, b.lower),
    noacc: levenshteinLength(a.noacc, b.noacc)
  };
}

function getDistanceObject(aViews, bViews) {
  var d = getDistance(aViews, bViews);
  return {
    distSrc: d,
    dist: {
      raw: d.raw.distance + d.raw.aLength - d.raw.bLength,
      trim: d.trim.distance + d.trim.aLength - d.trim.bLength,
      lower: d.lower.distance + d.lower.aLength - d.lower.bLength,
      noacc: d.noacc.distance + d.noacc.aLength - d.noacc.bLength
    }
  };
}

function compareDistanceObjects(a, b) {
  return a.noacc !== b.noacc ? a.noacc < b.noacc ? -1 : +1 : a.lower !== b.lower ? a.lower < b.lower ? -1 : +1 : a.trim !== b.trim ? a.trim < b.trim ? -1 : +1 : a.raw !== b.raw ? a.raw < b.raw ? -1 : +1 : 0;
}

function mergeClosest(closest, item, index, maxCount, total) {
  if (null == total || isNaN(total)) {
    // because null
    total = closest.length;
  }

  if (maxCount > 0) {
    if (index < maxCount) {
      // this is more efficient because we only insert
      // if index is lower than maxCount
      closest.splice(index, 0, item);
      closest.splice(maxCount, total - maxCount);
      return true;
    }
  } else {
    closest.splice(index, 0, item);
    return true;
  }

  return false;
}

function testMaxDistanceObject(item, maxDistance) {
  var dsrc = item.distSrc;
  var dist = item.dist;

  if (null == maxDistance) {
    return true;
  } else if (dsrc.noacc.distance === dsrc.noacc.bLength) {
    return false;
  } else if (maxDistance >= 0) {
    return !(dist.noacc > maxDistance);
  } else if ('object' === _typeof(maxDistance)) {
    return !(maxDistance.noacc >= 0 && dist.noacc > maxDistance.noacc || maxDistance.lower >= 0 && dist.lower > maxDistance.lower || maxDistance.trim >= 0 && dist.trim > maxDistance.trim || maxDistance.raw >= 0 && dist.raw > maxDistance.raw);
  }

  return true;
}

function insertClosest(closest, searchViews, str, data, maxDistance, maxCount) {
  var _getDistanceObject = getDistanceObject(searchViews, (0, _normalizeViews["default"])(str)),
      distSrc = _getDistanceObject.distSrc,
      dist = _getDistanceObject.dist;

  if (testMaxDistanceObject(dist, maxDistance)) {
    for (var i = 0, ii = closest.length; i < ii; i++) {
      var itemComp = compareDistanceObjects(dist, closest[i].dist);
      if (itemComp < 0) break;
    }

    return mergeClosest(closest, {
      distSrc: distSrc,
      dist: dist,
      str: str,
      data: data
    }, i, maxCount, ii);
  }

  return false;
}

function cutClosestDistance(closest, cutDistance) {
  // this function will discard entries that are more than
  // 'X' chars away from the first search result
  var c = closest.slice();
  var count = c.length;
  var dFirst = (c[0] || {}).dist;

  if (cutDistance && dFirst) {
    var dCut = {
      raw: cutDistance.raw == null ? null : dFirst.raw + cutDistance.raw,
      trim: cutDistance.trim == null ? null : dFirst.trim + cutDistance.trim,
      lower: cutDistance.lower == null ? null : dFirst.lower + cutDistance.lower,
      noacc: cutDistance.noacc == null ? null : dFirst.noacc + cutDistance.noacc
    };

    for (var i = 1; i < count; i++) {
      var d = c[i].dist;
      if (dCut.raw != null && d.raw > dCut.raw || dCut.trim != null && d.trim > dCut.trim || dCut.lower != null && d.lower > dCut.lower || dCut.noacc != null && d.noacc > dCut.noacc) break;
    }

    c.splice(i, count - i);
  }

  return c;
}

function search(opt) {
  var closest = [];
  var searchTerm;
  var maxCount;
  var maxDistance;
  var cutDistance;
  'object' === _typeof(opt) && init(opt);
  return {
    clear: clear,
    init: init,
    getDistance: getDistance,
    insert: insert,
    getClosest: getClosest
  };

  function clear() {
    closest = [];
  }

  function init(_ref) {
    var st = _ref.searchTerm,
        mc = _ref.maxCount,
        md = _ref.maxDistance,
        cd = _ref.cutDistance;
    if (null != st) searchTerm = (0, _normalizeViews["default"])(st);
    if (null != mc) maxCount = mc;
    if (null != md) maxDistance = md;
    if (null != cd) cutDistance = cd;
  }

  function getDistance(str) {
    return getDistanceObject(searchTerm, (0, _normalizeViews["default"])(str));
  }

  function insert(str, data) {
    return insertClosest(closest, searchTerm, str, data, maxDistance, maxCount);
  }

  function getClosest() {
    return cutClosestDistance(closest, cutDistance);
  }
}

var _default = search;
exports["default"] = _default;