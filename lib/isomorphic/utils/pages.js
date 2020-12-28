"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pages = pages;
exports.pagesCurrent = pagesCurrent;

function pages(n, steps) {
  if (!(steps instanceof Array)) steps = [1, 2, 5, 10];
  var m = (n - 1) * 0.5;
  var mult = 1;
  var d = [];
  var si = 0;
  var sc = steps.length;
  var sl = 0;

  while (si < sc) {
    var sp = steps[si];
    var p = sp * mult;

    if (p > m) {
      sl = p;
      break;
    }

    d.push(p);
    si += 1;

    if (si == sc) {
      mult *= steps[si - 1];
      si = steps[0] > 1 ? 0 : 1;
    }
  }

  var dr = [];

  for (si = 0, sc = d.length; si < sc; si++) {
    dr.unshift(n - d[si]);
  }

  var dm = sl > 0 && sl < n && (!dr.length || sl < dr[0]) ? [sl] : [];
  return d.concat(dm, dr);
}

function pagesCurrent(current, total, steps) {
  return pages(current, steps, 0).concat([current]).concat(pages(total - current + 1, steps, current));
}