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

var DM = function DM(server, _ref7) {
  var _this = this;

  var target = _ref7.target,
      _ref7$watchTarget = _ref7.watchTarget,
      watchTarget = _ref7$watchTarget === void 0 ? [] : _ref7$watchTarget,
      _ref7$parsers = _ref7.parsers,
      parsers = _ref7$parsers === void 0 ? {} : _ref7$parsers;

  _classCallCheck(this, DM);

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

    var b = JSON.parse(a.data).filter(function (v) {
      return v.url;
    }).reduce(function (r, v) {
      return _objectSpread({}, r, _defineProperty({}, "".concat(v.type, " ").concat(v.url), (0, _parse.createObject)(v.success.fields['Success 200'])));
    }, {});
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

var _default = DM;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJwYXJzZXJzIiwid2F0Y2hlciIsImNob2tpZGFyIiwid2F0Y2giLCJwZXJzaXN0ZW50IiwiaWdub3JlZCIsImN3ZCIsImRlcHRoIiwib24iLCJiaW5kU2VydmVyIiwiaW5kZXhBcnIiLCJtaW4iLCJNYXRoIiwibWF4IiwiX3JvdXRlciIsInN0YWNrIiwic3BsaWNlIiwia2V5cyIsImNhY2hlIiwiZmlsZSIsInNvbWUiLCJpbmNsdWRlcyIsImRiIiwiYXBwIiwiZ2xvYmFsIiwiZ2xvYiIsInN5bmMiLCJjbGVhckNhY2hlIiwiYXBpZG9jIiwic2V0TG9nZ2VyIiwiZGVidWciLCJ2ZXJib3NlIiwiaW5mbyIsIndhcm4iLCJlcnJvciIsImEiLCJwYXJzZSIsInNyYyIsImFwaWRvY1BhcnNlcnMiLCJzaWxlbnQiLCJzaW11bGF0ZSIsImNvbG9yaXplIiwibWFya2Rvd24iLCJjb25maWciLCJhcGlwcml2YXRlIiwiZW5jb2RpbmciLCJiIiwiSlNPTiIsImRhdGEiLCJ1cmwiLCJ0eXBlIiwic3VjY2VzcyIsImZpZWxkcyIsInVzZSIsIm1vY2tEYXRhIiwidGVzdCIsIlJlZ0V4cCIsInBhdGhuYW1lIiwicmVxIiwidG9Mb3dlckNhc2UiLCJpbmRleCIsIm5hbWUiLCJjcmVhdGVXYXRjaGVyIiwiZSIsIkFycmF5IiwiaXNBcnJheSIsImJvZHlQYXJzZXIiLCJq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aG9raWRhciwgeyBGU1dhdGNoZXIgfSBmcm9tICdjaG9raWRhcic7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgaHR0cFByb3h5TWlkZGxlIGZyb20gJ2h0dHAtcHJveHktbWlkZGxld2FyZSc7XG5pbXBvcnQgeyBkZWFsUGF0aCwgY3JlYXRlTW9ja0hhbmRsZXIsIHdpblBhdGgsIHdhcm4sIHdhcm5iZywgZXJyb3IsIGVycm9yYmcsIGp1ZGdlIH0gZnJvbSAnLi91dGlscy90b29scyc7XG5pbXBvcnQgYXBpZG9jIGZyb20gJ2FwaWRvYy1jb3JlJztcbmltcG9ydCB7IGNyZWF0ZU9iamVjdCB9IGZyb20gJy4vdXRpbHMvcGFyc2UnO1xuXG5jb25zdCBETVRBRyA9ICguLi5hcmc6IGFueVtdKSA9PiBhcmdbMl0oKTtcblxuY29uc3QgcmVxdWlyZUZpbGUgPSAoZmlsZXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgbGV0IGNvdW50OiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLnJlZHVjZSgociwgdikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXF1aXJlKHYpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVzdWx0KS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudFtrZXldID0gWy4uLihjb3VudFtrZXldIHx8IFtdKSwgdl07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5yLFxuICAgICAgICAgICAgICAgIC4uLih0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2Vycm9yYmcoYCAke3Z9IGApfSDmlofku7bmoLzlvI/kuI3nrKblkIjopoHmsYLvvIzlt7Lov4fmu6TvvIFgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9LCB7fSk7XG5cbiAgICBPYmplY3QuZW50cmllcyhjb3VudClcbiAgICAgICAgLmZpbHRlcigoW2ssIHZdOiBhbnkpID0+IHYubGVuZ3RoID4gMSlcbiAgICAgICAgLmZvckVhY2goKFtrLCB2XTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGNoYWxrLmJnWWVsbG93KGNoYWxrLndoaXRlKGAke21ldGhvZH1gKSksXG4gICAgICAgICAgICAgICAgY2hhbGsueWVsbG93KHBhdGgpLFxuICAgICAgICAgICAgICAgICflh7rnjrDmrKHmlbDvvJonLFxuICAgICAgICAgICAgICAgIGVycm9yYmcoY2hhbGsuYm9sZCh2Lmxlbmd0aCkpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHYuZm9yRWFjaCgobzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgJHt3YXJuYmcobyl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJZG1PcHRpb25zIHtcbiAgICBwYXJzZXJzOiBhbnk7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgd2F0Y2hUYXJnZXQ6IHN0cmluZyB8IHN0cmluZ1tdO1xufVxuY2xhc3MgRE0ge1xuICAgIHByaXZhdGUgdGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHdhdGNoVGFyZ2V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIHByaXZhdGUgYXBpZG9jUGFyc2VyczogYW55ID0ge307XG4gICAgcHJpdmF0ZSBhcGlkb2NUYXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgaW5kZXhBcnI6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSBzZXJ2ZXI6IGFueTtcbiAgICBwcml2YXRlIHdhdGNoZXI6IEZTV2F0Y2hlciB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBhbnksIHsgdGFyZ2V0LCB3YXRjaFRhcmdldCA9IFtdLCBwYXJzZXJzID0ge30gfTogSWRtT3B0aW9ucykge1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHRoaXMud2F0Y2hUYXJnZXQgPSBBcnJheS5pc0FycmF5KHdhdGNoVGFyZ2V0KSA/IHdhdGNoVGFyZ2V0IDogW3dhdGNoVGFyZ2V0XTtcblxuICAgICAgICB0aGlzLmFwaWRvY1BhcnNlcnMgPSBwYXJzZXJzO1xuXG4gICAgICAgIHNlcnZlci51c2UoYm9keVBhcnNlci5qc29uKHsgbGltaXQ6ICc1bWInLCBzdHJpY3Q6IGZhbHNlIH0pKTtcbiAgICAgICAgc2VydmVyLnVzZShcbiAgICAgICAgICAgIGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7XG4gICAgICAgICAgICAgICAgZXh0ZW5kZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbGltaXQ6ICc1bWInLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIGNyZWF0ZVdhdGNoZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMud2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKFt0aGlzLnRhcmdldCwgLi4udGhpcy53YXRjaFRhcmdldF0sIHtcbiAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVkOiAvKF58W1xcL1xcXFxdKVxcLi4qKD88IVxcLmpzKSQvLCAvL+W/veeVpeeCueaWh+S7tlxuICAgICAgICAgICAgY3dkOiAnLicsIC8v6KGo56S65b2T5YmN55uu5b2VXG4gICAgICAgICAgICBkZXB0aDogOTksIC8v5Yiw5L2N5LqGLi4uLlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YXRjaGVyLm9uKCdjaGFuZ2UnLCBwYXRoID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdhcm5iZygnRE0nKSwgd2FybignQ0hBTkdFRCcpLCBwYXRoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFNlcnZlcigpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g5riF6Zmk57yT5a2YXG4gICAgY2xlYXJDYWNoZSA9ICgpID0+IHtcbiAgICAgICAgLy8g5Yig6Zmk5pen55qEbW9ja1xuICAgICAgICBpZiAodGhpcy5pbmRleEFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnNwbGljZShtaW4sIG1heCAtIG1pbiArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXMocmVxdWlyZS5jYWNoZSkuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgICAgIGlmIChbLi4udGhpcy53YXRjaFRhcmdldCwgdGhpcy50YXJnZXRdLnNvbWUodiA9PiBmaWxlLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yKCdEZWxldGUgQ2FjaGUnKSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbZmlsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBiaW5kU2VydmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IHRoaXMudGFyZ2V0O1xuXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgIC8vIOazqOWFpXN0b3JlXG4gICAgICAgIChnbG9iYWwgYXMgYW55KS5ETSA9IHJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvLiouanMnKSk7XG5cbiAgICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cbiAgICAgICAgYXBpZG9jLnNldExvZ2dlcih7XG4gICAgICAgICAgICBkZWJ1ZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZXJib3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2FybjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhID0gYXBpZG9jLnBhcnNlKHtcbiAgICAgICAgICAgIHNyYzogdGhpcy53YXRjaFRhcmdldCxcbiAgICAgICAgICAgIHBhcnNlcnM6IHRoaXMuYXBpZG9jUGFyc2VycyxcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgIHNpbGVudDogZmFsc2UsXG4gICAgICAgICAgICB2ZXJib3NlOiBmYWxzZSxcbiAgICAgICAgICAgIHNpbXVsYXRlOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbG9yaXplOiB0cnVlLFxuICAgICAgICAgICAgbWFya2Rvd246IHRydWUsXG4gICAgICAgICAgICBjb25maWc6ICcuLycsXG4gICAgICAgICAgICBhcGlwcml2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiID0gSlNPTi5wYXJzZShhLmRhdGEpXG4gICAgICAgICAgICAuZmlsdGVyKCh2OiBhbnkpID0+IHYudXJsKVxuICAgICAgICAgICAgLnJlZHVjZSgocjogYW55LCB2OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5yLFxuICAgICAgICAgICAgICAgICAgICBbYCR7di50eXBlfSAke3YudXJsfWBdOiBjcmVhdGVPYmplY3Qodi5zdWNjZXNzLmZpZWxkc1snU3VjY2VzcyAyMDAnXSksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICBhcHAudXNlKERNVEFHKTtcblxuICAgICAgICBjb25zdCBtb2NrRGF0YTogYW55ID0gT2JqZWN0LmVudHJpZXMoeyAuLi5yZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLyEoLikqLmpzJykpLCAuLi5iIH0pO1xuICAgICAgICAvLyDmt7vliqDot6/nlLFcbiAgICAgICAgbW9ja0RhdGEuZm9yRWFjaCgoW2tleSwgZm5dOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoa2V5KTtcblxuICAgICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgICAgICBpZiAocGF0aCAmJiBtZXRob2QgJiYgL15cXC8vLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICBqdWRnZSghYXBwW21ldGhvZF0sIGBtZXRob2Qgb2YgJHtrZXl9IGlzIG5vdCB2YWxpZGApO1xuICAgICAgICAgICAgICAgIGp1ZGdlKFxuICAgICAgICAgICAgICAgICAgICAhKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBgbW9jayB2YWx1ZSBvZiAke3dhcm4oa2V5KX0gc2hvdWxkIGJlIGZ1bmN0aW9uIG9yIG9iamVjdCBvciBzdHJpbmcsIGJ1dCBnb3QgJHtlcnJvcih0eXBlb2YgZm4pfWAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51c2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwoLitcXCkvLnRlc3QocGF0aCkgPyBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKSA6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUHJveHlNaWRkbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhdGhuYW1lLCByZXE6IGFueSkgPT4gKG1ldGhvZCA/IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gbWV0aG9kLnRvTG93ZXJDYXNlKCkgOiB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogd2luUGF0aChmbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJbbWV0aG9kXShwYXRoLCBjcmVhdGVNb2NrSGFuZGxlcihmbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIHRoaXMuaW5kZXhBcnIgPSB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnJlZHVjZShcbiAgICAgICAgICAgIChyOiBudW1iZXJbXSwgeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0sIGluZGV4OiBudW1iZXIpID0+IChuYW1lID09PSBETVRBRy5uYW1lID8gWy4uLnIsIGluZGV4XSA6IHIpLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERNO1xuIl19