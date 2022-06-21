"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chokidar = _interopRequireDefault(require("chokidar"));

var _chalk = _interopRequireDefault(require("chalk"));

var _glob = _interopRequireDefault(require("glob"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _httpProxyMiddleware = _interopRequireDefault(require("http-proxy-middleware"));

var _cors = _interopRequireDefault(require("cors"));

var _tools = require("./utils/tools");

var _apidocCore = _interopRequireDefault(require("apidoc-core"));

var _parse = require("./utils/parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var DMTAG = function DMTAG() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  return arg[2]();
};

var requireFile = function requireFile(files) {
  var count = {};
  var result = files.reduce(function (r, v) {
    var result = require(v);

    if (_typeof(result) === 'object') {
      Object.entries(result).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            fn = _ref2[1];

        count[key] = [].concat(_toConsumableArray(count[key] || []), [v]);
      });
      return _objectSpread(_objectSpread({}, r), _typeof(result) === 'object' && result);
    } else {
      console.log("".concat((0, _tools.errorbg)(" ".concat(v, " ")), " \u6587\u4EF6\u683C\u5F0F\u4E0D\u7B26\u5408\u8981\u6C42\uFF0C\u5DF2\u8FC7\u6EE4\uFF01"));
      return r;
    }
  }, {});
  Object.entries(count).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return v.length > 1;
  }).forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        k = _ref6[0],
        v = _ref6[1];

    var _dealPath = (0, _tools.dealPath)(k),
        _dealPath2 = _slicedToArray(_dealPath, 2),
        path = _dealPath2[0],
        method = _dealPath2[1];

    console.log('');
    console.log(_chalk["default"].bgYellow(_chalk["default"].white("".concat(method))), _chalk["default"].yellow(path), '出现次数：', (0, _tools.errorbg)(_chalk["default"].bold(v.length)));
    v.forEach(function (o) {
      console.log("  ".concat((0, _tools.warnbg)(o)));
    });
    console.log('');
  });
  return result;
};

var DataMock = /*#__PURE__*/_createClass(function DataMock(server, _ref7) {
  var _this = this;

  var target = _ref7.target,
      _ref7$watchTarget = _ref7.watchTarget,
      watchTarget = _ref7$watchTarget === void 0 ? [] : _ref7$watchTarget,
      _ref7$parsers = _ref7.parsers,
      parsers = _ref7$parsers === void 0 ? {} : _ref7$parsers;

  _classCallCheck(this, DataMock);

  _defineProperty(this, "target", '');

  _defineProperty(this, "watchTarget", []);

  _defineProperty(this, "apidocParsers", {});

  _defineProperty(this, "apidocTarget", '');

  _defineProperty(this, "indexArr", []);

  _defineProperty(this, "server", void 0);

  _defineProperty(this, "watcher", null);

  _defineProperty(this, "createWatcher", function () {
    _this.watcher = _chokidar["default"].watch([_this.target].concat(_toConsumableArray(_this.watchTarget)), {
      persistent: true,
      ignored: /(^|[\/\\])\..*(?<!\.js)$/,
      //忽略点文件
      cwd: '.',
      //表示当前目录
      depth: 99 //到位了....

    });

    _this.watcher.on('change', function (path) {
      console.log((0, _tools.warnbg)('DM'), (0, _tools.warn)('CHANGED'), path);

      _this.bindServer();
    });
  });

  _defineProperty(this, "clearCache", function () {
    // 删除旧的mock
    if (_this.indexArr.length) {
      var min = Math.min.apply(Math, _toConsumableArray(_this.indexArr));
      var max = Math.max.apply(Math, _toConsumableArray(_this.indexArr));

      _this.server._router.stack.splice(min, max - min + 1);
    }

    Object.keys(require.cache).forEach(function (file) {
      if ([].concat(_toConsumableArray(_this.watchTarget), [_this.target]).some(function (v) {
        return file.includes(v);
      })) {
        // console.log(error('Delete Cache'), file);
        delete require.cache[file];
      }
    });
  });

  _defineProperty(this, "bindServer", function () {
    var db = _this.target;
    var app = _this.server; // 注入store

    global.DM = requireFile(_glob["default"].sync(db + '/.*.js'));

    _this.clearCache();

    _apidocCore["default"].setLogger({
      debug: function debug() {// console.log(arguments);
      },
      verbose: function verbose() {// console.log(arguments);
      },
      info: function info() {// console.log(arguments);
      },
      warn: function warn() {// console.log(arguments);
      },
      error: function error() {// console.log(arguments);
      }
    });

    var a = _apidocCore["default"].parse({
      src: _this.watchTarget,
      parsers: _this.apidocParsers,
      debug: false,
      silent: false,
      verbose: false,
      simulate: false,
      parse: false,
      colorize: true,
      markdown: true,
      config: './',
      apiprivate: false,
      encoding: 'utf8'
    });

    var b = a.data ? JSON.parse(a.data).filter(function (v) {
      return v.url;
    }).reduce(function (r, v) {
      return _objectSpread(_objectSpread({}, r), {}, _defineProperty({}, "".concat(v.type, " ").concat(v.url), (0, _parse.createObject)(v.success.fields['Success 200'])));
    }, {}) : {};
    app.use(DMTAG);
    var mockData = Object.entries(_objectSpread(_objectSpread({}, requireFile(_glob["default"].sync(db + '/!(.)*.js'))), b)); // 添加路由

    mockData.forEach(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          key = _ref9[0],
          fn = _ref9[1];

      var _dealPath3 = (0, _tools.dealPath)(key),
          _dealPath4 = _slicedToArray(_dealPath3, 2),
          path = _dealPath4[0],
          method = _dealPath4[1]; // 非本地路径过滤


      if (path && method && /^\//.test(path)) {
        (0, _tools.judge)(!app[method], "method of ".concat(key, " is not valid"));
        (0, _tools.judge)(!(typeof fn === 'function' || _typeof(fn) === 'object' || typeof fn === 'string'), "mock value of ".concat((0, _tools.warn)(key), " should be function or object or string, but got ").concat((0, _tools.error)(_typeof(fn))));

        if (typeof fn === 'string') {
          app.use(/\(.+\)/.test(path) ? new RegExp("^".concat(path, "$")) : path, (0, _httpProxyMiddleware["default"])(function (pathname, req) {
            return method ? req.method.toLowerCase() === method.toLowerCase() : true;
          }, {
            target: (0, _tools.winPath)(fn)
          }));
        } else {
          _this.server[method](path, (0, _tools.createMockHandler)(fn));
        }
      }
    });
    app.use(DMTAG);
    _this.indexArr = _this.server._router.stack.reduce(function (r, _ref10, index) {
      var name = _ref10.name;
      return name === DMTAG.name ? [].concat(_toConsumableArray(r), [index]) : r;
    }, []);
  });

  _defineProperty(this, "start", function () {
    try {
      _this.createWatcher();

      _this.bindServer();
    } catch (e) {
      console.log(e);
      console.log(); // outputError(e);
      // this.createWatcher();
    }
  });

  this.target = target;
  this.server = server;
  this.watchTarget = Array.isArray(watchTarget) ? watchTarget : [watchTarget];
  this.apidocParsers = parsers;
  server.use(_bodyParser["default"].json({
    limit: '5mb',
    strict: false
  }));
  server.use(_bodyParser["default"].urlencoded({
    extended: true,
    limit: '5mb'
  }));
  server.use((0, _cors["default"])());
  this.start();
});

var _default = DataMock;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZXJyb3JiZyIsImZpbHRlciIsImsiLCJsZW5ndGgiLCJkZWFsUGF0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIndhcm5iZyIsIkRhdGFNb2NrIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJwYXJzZXJzIiwid2F0Y2hlciIsImNob2tpZGFyIiwid2F0Y2giLCJwZXJzaXN0ZW50IiwiaWdub3JlZCIsImN3ZCIsImRlcHRoIiwib24iLCJ3YXJuIiwiYmluZFNlcnZlciIsImluZGV4QXJyIiwibWluIiwiTWF0aCIsIm1heCIsIl9yb3V0ZXIiLCJzdGFjayIsInNwbGljZSIsImtleXMiLCJjYWNoZSIsImZpbGUiLCJzb21lIiwiaW5jbHVkZXMiLCJkYiIsImFwcCIsImdsb2JhbCIsIkRNIiwiZ2xvYiIsInN5bmMiLCJjbGVhckNhY2hlIiwiYXBpZG9jIiwic2V0TG9nZ2VyIiwiZGVidWciLCJ2ZXJib3NlIiwiaW5mbyIsImVycm9yIiwiYSIsInBhcnNlIiwic3JjIiwiYXBpZG9jUGFyc2VycyIsInNpbGVudCIsInNpbXVsYXRlIiwiY29sb3JpemUiLCJtYXJrZG93biIsImNvbmZpZyIsImFwaXByaXZhdGUiLCJlbmNvZGluZyIsImIiLCJkYXRhIiwiSlNPTiIsInVybCIsInR5cGUiLCJjcmVhdGVPYmplY3QiLCJzdWNjZXNzIiwiZmllbGRzIiwidXNlIiwibW9ja0RhdGEiLCJ0ZXN0IiwianVkZ2UiLCJSZWdFeHAiLCJodHRwUHJveHlNaWRkbGUiLCJwYXRobmFtZSIsInJlcSIsInRvTG93ZXJDYXNlIiwid2luUGF0aCIsImNyZWF0ZU1vY2tIYW5kbGVyIiwiaW5kZXgiLCJuYW1lIiwiY3JlYXRlV2F0Y2hlciIsImUiLCJBcnJheSIsImlzQXJyYXkiLCJib2R5UGFyc2VyIiwianNvbiIsImxpbWl0Iiwic3RyaWN0IiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwiY29ycyIsInN0YXJ0Il0sInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaG9raWRhciwgeyBGU1dhdGNoZXIgfSBmcm9tICdjaG9raWRhcic7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgaHR0cFByb3h5TWlkZGxlIGZyb20gJ2h0dHAtcHJveHktbWlkZGxld2FyZSc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcbmltcG9ydCB7IGRlYWxQYXRoLCBjcmVhdGVNb2NrSGFuZGxlciwgd2luUGF0aCwgd2Fybiwgd2FybmJnLCBlcnJvciwgZXJyb3JiZywganVkZ2UgfSBmcm9tICcuL3V0aWxzL3Rvb2xzJztcbmltcG9ydCBhcGlkb2MgZnJvbSAnYXBpZG9jLWNvcmUnO1xuaW1wb3J0IHsgY3JlYXRlT2JqZWN0IH0gZnJvbSAnLi91dGlscy9wYXJzZSc7XG5cbmNvbnN0IERNVEFHID0gKC4uLmFyZzogYW55W10pID0+IGFyZ1syXSgpO1xuXG5jb25zdCByZXF1aXJlRmlsZSA9IChmaWxlczogc3RyaW5nW10pID0+IHtcbiAgICBsZXQgY291bnQ6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZmlsZXMucmVkdWNlKChyLCB2KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlcXVpcmUodik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZXN1bHQpLmZvckVhY2goKFtrZXksIGZuXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvdW50W2tleV0gPSBbLi4uKGNvdW50W2tleV0gfHwgW10pLCB2XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnIsXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7ZXJyb3JiZyhgICR7dn0gYCl9IOaWh+S7tuagvOW8j+S4jeespuWQiOimgeaxgu+8jOW3sui/h+a7pO+8gWApO1xuXG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgIH0sIHt9KTtcblxuICAgIE9iamVjdC5lbnRyaWVzKGNvdW50KVxuICAgICAgICAuZmlsdGVyKChbaywgdl06IGFueSkgPT4gdi5sZW5ndGggPiAxKVxuICAgICAgICAuZm9yRWFjaCgoW2ssIHZdOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBbcGF0aCwgbWV0aG9kXSA9IGRlYWxQYXRoKGspO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgY2hhbGsuYmdZZWxsb3coY2hhbGsud2hpdGUoYCR7bWV0aG9kfWApKSxcbiAgICAgICAgICAgICAgICBjaGFsay55ZWxsb3cocGF0aCksXG4gICAgICAgICAgICAgICAgJ+WHuueOsOasoeaVsO+8micsXG4gICAgICAgICAgICAgICAgZXJyb3JiZyhjaGFsay5ib2xkKHYubGVuZ3RoKSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdi5mb3JFYWNoKChvOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAke3dhcm5iZyhvKX1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElkbU9wdGlvbnMge1xuICAgIHBhcnNlcnM6IGFueTtcbiAgICB0YXJnZXQ6IHN0cmluZztcbiAgICB3YXRjaFRhcmdldDogc3RyaW5nIHwgc3RyaW5nW107XG59XG5jbGFzcyBEYXRhTW9jayB7XG4gICAgcHJpdmF0ZSB0YXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgd2F0Y2hUYXJnZXQ6IHN0cmluZ1tdID0gW107XG4gICAgcHJpdmF0ZSBhcGlkb2NQYXJzZXJzOiBhbnkgPSB7fTtcbiAgICBwcml2YXRlIGFwaWRvY1RhcmdldDogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBpbmRleEFycjogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHNlcnZlcjogYW55O1xuICAgIHByaXZhdGUgd2F0Y2hlcjogRlNXYXRjaGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGFueSwgeyB0YXJnZXQsIHdhdGNoVGFyZ2V0ID0gW10sIHBhcnNlcnMgPSB7fSB9OiBJZG1PcHRpb25zKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy53YXRjaFRhcmdldCA9IEFycmF5LmlzQXJyYXkod2F0Y2hUYXJnZXQpID8gd2F0Y2hUYXJnZXQgOiBbd2F0Y2hUYXJnZXRdO1xuXG4gICAgICAgIHRoaXMuYXBpZG9jUGFyc2VycyA9IHBhcnNlcnM7XG5cbiAgICAgICAgc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzVtYicsIHN0cmljdDogZmFsc2UgfSkpO1xuICAgICAgICBzZXJ2ZXIudXNlKFxuICAgICAgICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgICAgICAgICBleHRlbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogJzVtYicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgc2VydmVyLnVzZShjb3JzKCkpO1xuXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVXYXRjaGVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLndhdGNoZXIgPSBjaG9raWRhci53YXRjaChbdGhpcy50YXJnZXQsIC4uLnRoaXMud2F0Y2hUYXJnZXRdLCB7XG4gICAgICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgICAgICAgaWdub3JlZDogLyhefFtcXC9cXFxcXSlcXC4uKig/PCFcXC5qcykkLywgLy/lv73nlaXngrnmlofku7ZcbiAgICAgICAgICAgIGN3ZDogJy4nLCAvL+ihqOekuuW9k+WJjeebruW9lVxuICAgICAgICAgICAgZGVwdGg6IDk5LCAvL+WIsOS9jeS6hi4uLi5cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud2F0Y2hlci5vbignY2hhbmdlJywgcGF0aCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh3YXJuYmcoJ0RNJyksIHdhcm4oJ0NIQU5HRUQnKSwgcGF0aCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOa4hemZpOe8k+WtmFxuICAgIGNsZWFyQ2FjaGUgPSAoKSA9PiB7XG4gICAgICAgIC8vIOWIoOmZpOaXp+eahG1vY2tcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhBcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi50aGlzLmluZGV4QXJyKTtcbiAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuX3JvdXRlci5zdGFjay5zcGxpY2UobWluLCBtYXggLSBtaW4gKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICBpZiAoWy4uLnRoaXMud2F0Y2hUYXJnZXQsIHRoaXMudGFyZ2V0XS5zb21lKHYgPT4gZmlsZS5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcignRGVsZXRlIENhY2hlJyksIGZpbGUpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW2ZpbGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYmluZFNlcnZlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgZGIgPSB0aGlzLnRhcmdldDtcblxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAvLyDms6jlhaVzdG9yZVxuICAgICAgICAoZ2xvYmFsIGFzIGFueSkuRE0gPSByZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLy4qLmpzJykpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuXG4gICAgICAgIGFwaWRvYy5zZXRMb2dnZXIoe1xuICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVyYm9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYSA9IGFwaWRvYy5wYXJzZSh7XG4gICAgICAgICAgICBzcmM6IHRoaXMud2F0Y2hUYXJnZXQsXG4gICAgICAgICAgICBwYXJzZXJzOiB0aGlzLmFwaWRvY1BhcnNlcnMsXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdmVyYm9zZTogZmFsc2UsXG4gICAgICAgICAgICBzaW11bGF0ZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgICAgICBjb2xvcml6ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1hcmtkb3duOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlnOiAnLi8nLFxuICAgICAgICAgICAgYXBpcHJpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYiA9IGEuZGF0YVxuICAgICAgICAgICAgPyBKU09OLnBhcnNlKGEuZGF0YSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHY6IGFueSkgPT4gdi51cmwpXG4gICAgICAgICAgICAgICAgICAucmVkdWNlKChyOiBhbnksIHY6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtgJHt2LnR5cGV9ICR7di51cmx9YF06IGNyZWF0ZU9iamVjdCh2LnN1Y2Nlc3MuZmllbGRzWydTdWNjZXNzIDIwMCddKSxcbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSwge30pXG4gICAgICAgICAgICA6IHt9O1xuXG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIGNvbnN0IG1vY2tEYXRhOiBhbnkgPSBPYmplY3QuZW50cmllcyh7IC4uLnJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvISguKSouanMnKSksIC4uLmIgfSk7XG4gICAgICAgIC8vIOa3u+WKoOi3r+eUsVxuICAgICAgICBtb2NrRGF0YS5mb3JFYWNoKChba2V5LCBmbl06IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrZXkpO1xuXG4gICAgICAgICAgICAvLyDpnZ7mnKzlnLDot6/lvoTov4fmu6RcbiAgICAgICAgICAgIGlmIChwYXRoICYmIG1ldGhvZCAmJiAvXlxcLy8udGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgIGp1ZGdlKCFhcHBbbWV0aG9kXSwgYG1ldGhvZCBvZiAke2tleX0gaXMgbm90IHZhbGlkYCk7XG4gICAgICAgICAgICAgICAganVkZ2UoXG4gICAgICAgICAgICAgICAgICAgICEodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBmbiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGZuID09PSAnc3RyaW5nJyksXG4gICAgICAgICAgICAgICAgICAgIGBtb2NrIHZhbHVlIG9mICR7d2FybihrZXkpfSBzaG91bGQgYmUgZnVuY3Rpb24gb3Igb2JqZWN0IG9yIHN0cmluZywgYnV0IGdvdCAke2Vycm9yKHR5cGVvZiBmbil9YCxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLnVzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIC9cXCguK1xcKS8udGVzdChwYXRoKSA/IG5ldyBSZWdFeHAoYF4ke3BhdGh9JGApIDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBQcm94eU1pZGRsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGF0aG5hbWUsIHJlcTogYW55KSA9PiAobWV0aG9kID8gcmVxLm1ldGhvZC50b0xvd2VyQ2FzZSgpID09PSBtZXRob2QudG9Mb3dlckNhc2UoKSA6IHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB3aW5QYXRoKGZuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZlclttZXRob2RdKHBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyKGZuKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwLnVzZShETVRBRyk7XG5cbiAgICAgICAgdGhpcy5pbmRleEFyciA9IHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2sucmVkdWNlKFxuICAgICAgICAgICAgKHI6IG51bWJlcltdLCB7IG5hbWUgfTogeyBuYW1lOiBzdHJpbmcgfSwgaW5kZXg6IG51bWJlcikgPT4gKG5hbWUgPT09IERNVEFHLm5hbWUgPyBbLi4uciwgaW5kZXhdIDogciksXG4gICAgICAgICAgICBbXSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgc3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFNlcnZlcigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICAgICAgICAvLyBvdXRwdXRFcnJvcihlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlV2F0Y2hlcigpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YU1vY2s7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsU0FBUkEsS0FBUTtFQUFBLGtDQUFJQyxHQUFKO0lBQUlBLEdBQUo7RUFBQTs7RUFBQSxPQUFtQkEsR0FBRyxDQUFDLENBQUQsQ0FBSCxFQUFuQjtBQUFBLENBQWQ7O0FBRUEsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsS0FBRCxFQUFxQjtFQUNyQyxJQUFJQyxLQUFVLEdBQUcsRUFBakI7RUFFQSxJQUFNQyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0csTUFBTixDQUFhLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0lBQ2xDLElBQU1ILE1BQU0sR0FBR0ksT0FBTyxDQUFDRCxDQUFELENBQXRCOztJQUVBLElBQUksUUFBT0gsTUFBUCxNQUFrQixRQUF0QixFQUFnQztNQUM1QkssTUFBTSxDQUFDQyxPQUFQLENBQWVOLE1BQWYsRUFBdUJPLE9BQXZCLENBQStCLGdCQUFlO1FBQUE7UUFBQSxJQUFiQyxHQUFhO1FBQUEsSUFBUkMsRUFBUTs7UUFDMUNWLEtBQUssQ0FBQ1MsR0FBRCxDQUFMLGdDQUFrQlQsS0FBSyxDQUFDUyxHQUFELENBQUwsSUFBYyxFQUFoQyxJQUFxQ0wsQ0FBckM7TUFDSCxDQUZEO01BSUEsdUNBQ09ELENBRFAsR0FFUSxRQUFPRixNQUFQLE1BQWtCLFFBQWxCLElBQThCQSxNQUZ0QztJQUlILENBVEQsTUFTTztNQUNIVSxPQUFPLENBQUNDLEdBQVIsV0FBZSxJQUFBQyxjQUFBLGFBQVlULENBQVosT0FBZjtNQUVBLE9BQU9ELENBQVA7SUFDSDtFQUNKLENBakJjLEVBaUJaLEVBakJZLENBQWY7RUFtQkFHLE1BQU0s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