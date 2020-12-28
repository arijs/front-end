"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testaDir = testaDir;
exports.openDir = openDir;
exports.openDirSub = openDirSub;
exports.openDirArray = openDirArray;
exports.testaFile = testaFile;
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function testaDir(dir, cb) {
  _fs["default"].stat(dir, function (err, stat) {
    if (err) {
      if ('ENOENT' === err.code) {
        return cb(null, false);
      } else {
        return cb(err);
      }
    } else if (stat.isDirectory()) {
      return cb(null, true);
    } else {
      err = new Error('path exists but is not a directory: ' + dir);
      err.code = err.errno = 'ENOTDIR';
      return cb(err);
    }
  });
}

function openDir(dir, cb) {
  testaDir(dir, function (err, exists) {
    if (err) {
      return cb(err);
    } else if (exists) {
      return cb();
    } else {
      _fs["default"].mkdir(dir, function (err) {
        if (err) {
          if ('EEXIST' === err.code) {
            // but I just checked...
            return openDir(dir, cb);
          } else {
            return cb(err);
          }
        } else {
          return cb();
        }
      });
    }
  });
}

function openDirSub(base, sub, cb) {
  return openDir(_path["default"].join(base, sub), cb);
}

function openDirArray(base, arr, cb) {
  if (arr.length) {
    var dir = arr.shift();
    base = base ? _path["default"].join(base, dir) : dir;
    return openDir(base, function (err) {
      if (err) {
        return cb(err);
      } else {
        openDirArray(base, arr, cb);
      }
    });
  } else {
    return cb();
  }
}

function testaFile(file, cb) {
  _fs["default"].open(file, 'r', function (err, fd) {
    if (err) {
      if ('ENOENT' === err.code) {
        return cb(null, false);
      } else {
        return cb(err);
      }
    } else {
      _fs["default"].close(fd, function (err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, true);
        }
      });
    }
  });
}

openDir.sub = openDirSub;
openDir.array = openDirArray;
openDir.test = testaDir;
openDir.testFile = testaFile;
var _default = openDir;
exports["default"] = _default;