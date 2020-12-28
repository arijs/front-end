"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = initVueLoaders;

var _forEach = _interopRequireDefault(require("../utils/for-each"));

var _forEachProperty = _interopRequireDefault(require("../utils/for-each-property"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import inspectObj from '../utils/inspect.mjs';
function nop() {}

function initVueLoaders(comps, _ref) {
  var onResolveDefined = _ref.onResolveDefined,
      onResolveFound = _ref.onResolveFound,
      onResolveNotFound = _ref.onResolveNotFound,
      Vue = _ref.Vue,
      compile = _ref.compile,
      jsGlobal = _ref.jsGlobal,
      jsContext = _ref.jsContext,
      jsOnError = _ref.jsOnError,
      prefixMatcher = _ref.prefixMatcher;
  (0, _forEach["default"])(comps, function (Comp, i) {
    jsGlobal[Comp.name] = comps[i] = Comp = prefixMatcher(_objectSpread(_objectSpread({
      map: {},
      // the js file will save the component options here
      mapCss: {},
      // this is used in the prerender to get all css files
      setCompHtml: setCompHtml,
      jsContext: jsContext,
      jsOnError: jsOnError
    }, Comp), {}, {
      onLoad: _objectSpread({
        js: function js(_, _ref2) {
          var path = _ref2.path;
          // here we get the saved js options to assemble the component
          return Comp.map[path];
        },
        css: function css(data, match) {
          Comp.mapCss[match.path] = {
            opt: match,
            data: Comp.storeCssData ? data : null
          };
        }
      }, Comp.onLoad)
    }));
  });
  onResolveDefined = onResolveDefined instanceof Function ? onResolveDefined : nop;
  onResolveFound = onResolveFound instanceof Function ? onResolveFound : nop;
  onResolveNotFound = onResolveNotFound instanceof Function ? onResolveNotFound : nop;
  return {
    resolveUserCompLoader: resolveUserCompLoader,
    resolveUserComponent: resolveUserComponent,
    resolveAsyncComponent: resolveAsyncComponent,
    getCompsCss: getCompsCss,
    getCompsLoad: getCompsLoad,
    destroy: destroy
  };

  function setCompHtml(_x, _x2) {
    return _setCompHtml.apply(this, arguments);
  }

  function _setCompHtml() {
    _setCompHtml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(js, html) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (compile instanceof Function) {
                html = compile(html).code;
                html = Function.call(null, 'Vue', html);
                js.render = html(Vue);
              } else {
                js.template = html;
              }

              return _context.abrupt("return", js);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _setCompHtml.apply(this, arguments);
  }

  function resolveUserCompLoader(name) {
    return (0, _forEach["default"])(comps, function (comp) {
      var loader = comp.loader(name);

      if (loader) {
        this.result = loader;
        return this._break;
      }
    });
  }

  function resolveUserComponent(name) {
    var defined, loader, match;
    (0, _forEach["default"])(comps, function (comp) {
      defined = comp.mapCache[name];
      loader = comp.loader(name);

      if (loader) {
        match = comp;
        return this._break;
      }
    });

    if (defined) {
      // console.log('/** user component predefined **/', match.name, name);
      onResolveDefined(match, name);
      return loader;
    } else if (loader) {
      // console.log('/** user component found **/', match.name, name);
      onResolveFound(match, name); // console.log(' +  attempt to load', name);
      // var t = Date.now();
      // Promise.race([
      // 	loader(),
      // 	rejectTimeout(5000)
      // ]).then(function(comp) {
      // 	console.log(' +  comp loaded in '+(Date.now()-t), name, inspectObj(comp, 1));
      // }).catch(function() {
      // 	console.log(' +  comp load failed in '+(Date.now()-t), name);
      // });

      return loader;
    } else {
      // console.log('/** user component NOT found **/', name);
      onResolveNotFound(name);
    }
  } // function rejectTimeout(time) {
  // 	return new Promise(function(resolve, reject) {
  // 		setTimeout(reject, time || 0);
  // 	});
  // }


  function resolveAsyncComponent(name) {
    var _loader = resolveUserComponent(name);

    return _loader instanceof Function ? Vue.defineAsyncComponent({
      loader: function loader() {
        return _loader().then(function (load) {
          return load.comp.data;
        });
      },
      name: 'loader--' + name
    }) : undefined;
  }

  function getCompsCss() {
    var list = [];
    (0, _forEach["default"])(comps, function (comp) {
      (0, _forEachProperty["default"])(comp.mapCss, function (item, k) {
        // if (!item) {
        // 	console.error(
        // 		'  <!> Empty mapCss val in '+JSON.stringify(comp.name)+
        // 		' key '+JSON.stringify(k)+
        // 		' origin '+JSON.stringify(jsGlobal.originRoute)
        // 	);
        // }
        item.comp = comp.name;
        list.push(item);
      });
    });
    return list;
  }

  function getCompsLoad() {
    var list = [];
    (0, _forEach["default"])(comps, function (comp) {
      (0, _forEachProperty["default"])(comp.mapCache, function (load) {
        load.comp = comp.name;
        list.push(load);
      });
    });
    return list;
  }

  function destroy() {
    (0, _forEach["default"])(comps, function (comp) {
      comp.map = undefined;
      comp.mapCss = undefined;
      comp.mapCache = undefined;
      comp.mapLoading = undefined;
      return this._remove;
    });
  }
}