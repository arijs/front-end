"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _allCallback = _interopRequireDefault(require("../../utils/all-callback"));

var _addStoreKeyAsync = _interopRequireDefault(require("./add-store-key-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var capacitorstore = {
  s: function () {
    try {
      var s = Capacitor.Plugins.Storage;
      if (s && s.get instanceof Function && s.set instanceof Function && s.remove instanceof Function && s.clear instanceof Function && s.keys instanceof Function) return s;
    } catch (e) {}
  }(),
  type: 'capacitorStorage',
  set: function set(key, val, cb) {
    this.s.set({
      key: key,
      value: JSON.stringify(val)
    }).then(cb)["catch"](cb);
  },
  get: function get(key, cb) {
    this.s.get({
      key: key
    }).then(function (ret) {
      var val = ret.value;

      if ('string' === typeof val) {
        try {
          val = JSON.parse(val);
        } catch (e) {}
      }

      cb(null, val);
    })["catch"](cb);
  },
  remove: function remove(key, cb) {
    this.s.remove({
      key: key
    }).then(cb)["catch"](cb);
  },
  removeAll: function removeAll(cb) {
    this.s.clear().then(cb)["catch"](cb);
  },
  getAll: function getAll(cb) {
    var self = this;
    this.s.keys().then(function (keys) {
      keys = keys.keys;
      var c = keys.length;
      var item = (0, _allCallback["default"])({
        valueMap: {},
        errors: [],
        count: 0,
        keys: keys,
        onDone: function onDone(err, value) {
          this.count++;
          this.valueMap[this._current] = value;
          if (err) this.errors.push(err);
        },
        onFinish: function onFinish() {
          var errors = this.errors;
          var ec = errors.length;
          var error = null;

          if (ec) {
            error = new Error((1 == ec ? '1 Error' : ec + ' Errors') + ' getting ' + this.count + ' keys from capacitor storage');
            error.list = errors;
          }

          cb(error, this.valueMap, this.keys);
        }
      });

      for (var i = 0; i < c; i++) {
        self.get(keys[i], item(keys[i]));
      }
    })["catch"](cb);
  }
};
capacitorstore = (0, _addStoreKeyAsync["default"])(capacitorstore);
capacitorstore = (0, _addStoreKeyAsync["default"])(capacitorstore);
var _default = capacitorstore;
exports["default"] = _default;