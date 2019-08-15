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

var _tools = require("./utils/tools");

var _apidocCore = _interopRequireDefault(require("apidoc-core"));

var _parse = require("./utils/parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
      return _objectSpread({}, r, {}, _typeof(result) === 'object' && result);
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

var DataMock = function DataMock(server, _ref7) {
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
      return _objectSpread({}, r, _defineProperty({}, "".concat(v.type, " ").concat(v.url), (0, _parse.createObject)(v.success.fields['Success 200'])));
    }, {}) : {};
    app.use(DMTAG);
    var mockData = Object.entries(_objectSpread({}, requireFile(_glob["default"].sync(db + '/!(.)*.js')), {}, b)); // 添加路由

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
  this.start();
};

var _default = DataMock;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRhdGFNb2NrIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJwYXJzZXJzIiwid2F0Y2hlciIsImNob2tpZGFyIiwid2F0Y2giLCJwZXJzaXN0ZW50IiwiaWdub3JlZCIsImN3ZCIsImRlcHRoIiwib24iLCJiaW5kU2VydmVyIiwiaW5kZXhBcnIiLCJtaW4iLCJNYXRoIiwibWF4IiwiX3JvdXRlciIsInN0YWNrIiwic3BsaWNlIiwia2V5cyIsImNhY2hlIiwiZmlsZSIsInNvbWUiLCJpbmNsdWRlcyIsImRiIiwiYXBwIiwiZ2xvYmFsIiwiRE0iLCJnbG9iIiwic3luYyIsImNsZWFyQ2FjaGUiLCJhcGlkb2MiLCJzZXRMb2dnZXIiLCJkZWJ1ZyIsInZlcmJvc2UiLCJpbmZvIiwid2FybiIsImVycm9yIiwiYSIsInBhcnNlIiwic3JjIiwiYXBpZG9jUGFyc2VycyIsInNpbGVudCIsInNpbXVsYXRlIiwiY29sb3JpemUiLCJtYXJrZG93biIsImNvbmZpZyIsImFwaXByaXZhdGUiLCJlbmNvZGluZyIsImIiLCJkYXRhIiwiSlNPTiIsInVybCIsInR5cGUiLCJzdWNjZXNzIiwiZmllbGRzIiwidXNlIiwibW9ja0RhdGEiLCJ0ZXN0IiwiUmVnRXhwIiwicGF0aG5hbWUiLCJyZXEiLCJ0b0xvd2VyQ2FzZSIsImluZGV4IiwibmFtZSIsImNyZWF0ZVdhdGNoZXIiLCJlIiwiQXJyYXkiLCJpc0FycmF5IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRO0FBQUEsb0NBQUlDLEdBQUo7QUFBSUEsSUFBQUEsR0FBSjtBQUFBOztBQUFBLFNBQW1CQSxHQUFHLENBQUMsQ0FBRCxDQUFILEVBQW5CO0FBQUEsQ0FBZDs7QUFFQSxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxLQUFELEVBQXFCO0FBQ3JDLE1BQUlDLEtBQVUsR0FBRyxFQUFqQjtBQUVBLE1BQU1DLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxNQUFOLENBQWEsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbEMsUUFBTUgsTUFBTSxHQUFHSSxPQUFPLENBQUNELENBQUQsQ0FBdEI7O0FBRUEsUUFBSSxRQUFPSCxNQUFQLE1BQWtCLFFBQXRCLEVBQWdDO0FBQzVCSyxNQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZU4sTUFBZixFQUF1Qk8sT0FBdkIsQ0FBK0IsZ0JBQWU7QUFBQTtBQUFBLFlBQWJDLEdBQWE7QUFBQSxZQUFSQyxFQUFROztBQUMxQ1YsUUFBQUEsS0FBSyxDQUFDUyxHQUFELENBQUwsZ0NBQWtCVCxLQUFLLENBQUNTLEdBQUQsQ0FBTCxJQUFjLEVBQWhDLElBQXFDTCxDQUFyQztBQUNILE9BRkQ7QUFJQSwrQkFDT0QsQ0FEUCxNQUVRLFFBQU9GLE1BQVAsTUFBa0IsUUFBbEIsSUFBOEJBLE1BRnRDO0FBSUgsS0FURCxNQVNPO0FBQ0hVLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixXQUFlLCtCQUFZUixDQUFaLE9BQWY7QUFFQSxhQUFPRCxDQUFQO0FBQ0g7QUFDSixHQWpCYyxFQWlCWixFQWpCWSxDQUFmO0FBbUJBRyxFQUFBQSxN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SCxDOztlQXVJVTdFLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hva2lkYXIsIHsgRlNXYXRjaGVyIH0gZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGh0dHBQcm94eU1pZGRsZSBmcm9tICdodHRwLXByb3h5LW1pZGRsZXdhcmUnO1xuaW1wb3J0IHsgZGVhbFBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyLCB3aW5QYXRoLCB3YXJuLCB3YXJuYmcsIGVycm9yLCBlcnJvcmJnLCBqdWRnZSB9IGZyb20gJy4vdXRpbHMvdG9vbHMnO1xuaW1wb3J0IGFwaWRvYyBmcm9tICdhcGlkb2MtY29yZSc7XG5pbXBvcnQgeyBjcmVhdGVPYmplY3QgfSBmcm9tICcuL3V0aWxzL3BhcnNlJztcblxuY29uc3QgRE1UQUcgPSAoLi4uYXJnOiBhbnlbXSkgPT4gYXJnWzJdKCk7XG5cbmNvbnN0IHJlcXVpcmVGaWxlID0gKGZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIGxldCBjb3VudDogYW55ID0ge307XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5yZWR1Y2UoKHIsIHYpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVxdWlyZSh2KTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnRba2V5XSA9IFsuLi4oY291bnRba2V5XSB8fCBbXSksIHZdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtlcnJvcmJnKGAgJHt2fSBgKX0g5paH5Lu25qC85byP5LiN56ym5ZCI6KaB5rGC77yM5bey6L+H5ruk77yBYCk7XG5cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgT2JqZWN0LmVudHJpZXMoY291bnQpXG4gICAgICAgIC5maWx0ZXIoKFtrLCB2XTogYW55KSA9PiB2Lmxlbmd0aCA+IDEpXG4gICAgICAgIC5mb3JFYWNoKChbaywgdl06IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoayk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBjaGFsay5iZ1llbGxvdyhjaGFsay53aGl0ZShgJHttZXRob2R9YCkpLFxuICAgICAgICAgICAgICAgIGNoYWxrLnllbGxvdyhwYXRoKSxcbiAgICAgICAgICAgICAgICAn5Ye6546w5qyh5pWw77yaJyxcbiAgICAgICAgICAgICAgICBlcnJvcmJnKGNoYWxrLmJvbGQodi5sZW5ndGgpKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2LmZvckVhY2goKG86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgICR7d2FybmJnKG8pfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRtT3B0aW9ucyB7XG4gICAgcGFyc2VyczogYW55O1xuICAgIHRhcmdldDogc3RyaW5nO1xuICAgIHdhdGNoVGFyZ2V0OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cbmNsYXNzIERhdGFNb2NrIHtcbiAgICBwcml2YXRlIHRhcmdldDogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSB3YXRjaFRhcmdldDogc3RyaW5nW10gPSBbXTtcbiAgICBwcml2YXRlIGFwaWRvY1BhcnNlcnM6IGFueSA9IHt9O1xuICAgIHByaXZhdGUgYXBpZG9jVGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGluZGV4QXJyOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgc2VydmVyOiBhbnk7XG4gICAgcHJpdmF0ZSB3YXRjaGVyOiBGU1dhdGNoZXIgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHNlcnZlcjogYW55LCB7IHRhcmdldCwgd2F0Y2hUYXJnZXQgPSBbXSwgcGFyc2VycyA9IHt9IH06IElkbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLndhdGNoVGFyZ2V0ID0gQXJyYXkuaXNBcnJheSh3YXRjaFRhcmdldCkgPyB3YXRjaFRhcmdldCA6IFt3YXRjaFRhcmdldF07XG5cbiAgICAgICAgdGhpcy5hcGlkb2NQYXJzZXJzID0gcGFyc2VycztcblxuICAgICAgICBzZXJ2ZXIudXNlKGJvZHlQYXJzZXIuanNvbih7IGxpbWl0OiAnNW1iJywgc3RyaWN0OiBmYWxzZSB9KSk7XG4gICAgICAgIHNlcnZlci51c2UoXG4gICAgICAgICAgICBib2R5UGFyc2VyLnVybGVuY29kZWQoe1xuICAgICAgICAgICAgICAgIGV4dGVuZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxpbWl0OiAnNW1iJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVXYXRjaGVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLndhdGNoZXIgPSBjaG9raWRhci53YXRjaChbdGhpcy50YXJnZXQsIC4uLnRoaXMud2F0Y2hUYXJnZXRdLCB7XG4gICAgICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgICAgICAgaWdub3JlZDogLyhefFtcXC9cXFxcXSlcXC4uKig/PCFcXC5qcykkLywgLy/lv73nlaXngrnmlofku7ZcbiAgICAgICAgICAgIGN3ZDogJy4nLCAvL+ihqOekuuW9k+WJjeebruW9lVxuICAgICAgICAgICAgZGVwdGg6IDk5LCAvL+WIsOS9jeS6hi4uLi5cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud2F0Y2hlci5vbignY2hhbmdlJywgcGF0aCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh3YXJuYmcoJ0RNJyksIHdhcm4oJ0NIQU5HRUQnKSwgcGF0aCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOa4hemZpOe8k+WtmFxuICAgIGNsZWFyQ2FjaGUgPSAoKSA9PiB7XG4gICAgICAgIC8vIOWIoOmZpOaXp+eahG1vY2tcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhBcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi50aGlzLmluZGV4QXJyKTtcbiAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuX3JvdXRlci5zdGFjay5zcGxpY2UobWluLCBtYXggLSBtaW4gKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHJlcXVpcmUuY2FjaGUpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICBpZiAoWy4uLnRoaXMud2F0Y2hUYXJnZXQsIHRoaXMudGFyZ2V0XS5zb21lKHYgPT4gZmlsZS5pbmNsdWRlcyh2KSkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcignRGVsZXRlIENhY2hlJyksIGZpbGUpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW2ZpbGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYmluZFNlcnZlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgZGIgPSB0aGlzLnRhcmdldDtcblxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLnNlcnZlcjtcblxuICAgICAgICAvLyDms6jlhaVzdG9yZVxuICAgICAgICAoZ2xvYmFsIGFzIGFueSkuRE0gPSByZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLy4qLmpzJykpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJDYWNoZSgpO1xuXG4gICAgICAgIGFwaWRvYy5zZXRMb2dnZXIoe1xuICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVyYm9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYSA9IGFwaWRvYy5wYXJzZSh7XG4gICAgICAgICAgICBzcmM6IHRoaXMud2F0Y2hUYXJnZXQsXG4gICAgICAgICAgICBwYXJzZXJzOiB0aGlzLmFwaWRvY1BhcnNlcnMsXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdmVyYm9zZTogZmFsc2UsXG4gICAgICAgICAgICBzaW11bGF0ZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgICAgICBjb2xvcml6ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1hcmtkb3duOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlnOiAnLi8nLFxuICAgICAgICAgICAgYXBpcHJpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYiA9IGEuZGF0YSA/IEpTT04ucGFyc2UoYS5kYXRhKVxuICAgICAgICAgICAgLmZpbHRlcigodjogYW55KSA9PiB2LnVybClcbiAgICAgICAgICAgIC5yZWR1Y2UoKHI6IGFueSwgdjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAgICAgW2Ake3YudHlwZX0gJHt2LnVybH1gXTogY3JlYXRlT2JqZWN0KHYuc3VjY2Vzcy5maWVsZHNbJ1N1Y2Nlc3MgMjAwJ10pLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LCB7fSkgOiB7fTtcblxuICAgICAgICBhcHAudXNlKERNVEFHKTtcblxuICAgICAgICBjb25zdCBtb2NrRGF0YTogYW55ID0gT2JqZWN0LmVudHJpZXMoeyAuLi5yZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLyEoLikqLmpzJykpLCAuLi5iIH0pO1xuICAgICAgICAvLyDmt7vliqDot6/nlLFcbiAgICAgICAgbW9ja0RhdGEuZm9yRWFjaCgoW2tleSwgZm5dOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoa2V5KTtcblxuICAgICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgICAgICBpZiAocGF0aCAmJiBtZXRob2QgJiYgL15cXC8vLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICBqdWRnZSghYXBwW21ldGhvZF0sIGBtZXRob2Qgb2YgJHtrZXl9IGlzIG5vdCB2YWxpZGApO1xuICAgICAgICAgICAgICAgIGp1ZGdlKFxuICAgICAgICAgICAgICAgICAgICAhKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBgbW9jayB2YWx1ZSBvZiAke3dhcm4oa2V5KX0gc2hvdWxkIGJlIGZ1bmN0aW9uIG9yIG9iamVjdCBvciBzdHJpbmcsIGJ1dCBnb3QgJHtlcnJvcih0eXBlb2YgZm4pfWAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51c2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwoLitcXCkvLnRlc3QocGF0aCkgPyBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKSA6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUHJveHlNaWRkbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhdGhuYW1lLCByZXE6IGFueSkgPT4gKG1ldGhvZCA/IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gbWV0aG9kLnRvTG93ZXJDYXNlKCkgOiB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogd2luUGF0aChmbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJbbWV0aG9kXShwYXRoLCBjcmVhdGVNb2NrSGFuZGxlcihmbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIHRoaXMuaW5kZXhBcnIgPSB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnJlZHVjZShcbiAgICAgICAgICAgIChyOiBudW1iZXJbXSwgeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0sIGluZGV4OiBudW1iZXIpID0+IChuYW1lID09PSBETVRBRy5uYW1lID8gWy4uLnIsIGluZGV4XSA6IHIpLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFNb2NrO1xuIl19