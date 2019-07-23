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
      watchTarget = _ref7$watchTarget === void 0 ? [] : _ref7$watchTarget;

  _classCallCheck(this, DM);

  _defineProperty(this, "target", '');

  _defineProperty(this, "watchTarget", []);

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

    app.use(DMTAG); // 添加路由

    Object.entries(requireFile(_glob["default"].sync(db + '/!(.)*.js'))).forEach(function (_ref8) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJ3YXRjaGVyIiwiY2hva2lkYXIiLCJ3YXRjaCIsInBlcnNpc3RlbnQiLCJpZ25vcmVkIiwiY3dkIiwiZGVwdGgiLCJvbiIsImJpbmRTZXJ2ZXIiLCJpbmRleEFyciIsIm1pbiIsIk1hdGgiLCJtYXgiLCJfcm91dGVyIiwic3RhY2siLCJzcGxpY2UiLCJrZXlzIiwiY2FjaGUiLCJmaWxlIiwic29tZSIsImluY2x1ZGVzIiwiZGIiLCJhcHAiLCJnbG9iYWwiLCJnbG9iIiwic3luYyIsImNsZWFyQ2FjaGUiLCJ1c2UiLCJ0ZXN0IiwiUmVnRXhwIiwicGF0aG5hbWUiLCJyZXEiLCJ0b0xvd2VyQ2FzZSIsImluZGV4IiwibmFtZSIsImNyZWF0ZVdhdGNoZXIiLCJlIiwiQXJyYXkiLCJpc0FycmF5IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRO0FBQUEsb0NBQUlDLEdBQUo7QUFBSUEsSUFBQUEsR0FBSjtBQUFBOztBQUFBLFNBQW1CQSxHQUFHLENBQUMsQ0FBRCxDQUFI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TCxHQUFjQSxNQUFkO0FBQ0EsT0FBS0UsV0FBTCxHQUFtQnNDLEtBQUssQ0FBQ0MsT0FBTixDQUFjdkMsV0FBZCxJQUE2QkEsV0FBN0IsR0FBMkMsQ0FBQ0EsV0FBRCxDQUE5RDtBQUVBRixFQUFBQSxNQUFNLENBQUM4QixHQUFQLENBQVdZLHVCQUFXQyxJQUFYLENBQWdCO0FBQUVDLElBQUFBLEtBQUssRUFBRSxLQUFUO0FBQWdCQyxJQUFBQSxNQUFNLEVBQUU7QUFBeEIsR0FBaEIsQ0FBWDtBQUNBN0MsRUFBQUEsTUFBTSxDQUFDOEIsR0FBUCxDQUNJWSx1QkFBV0ksVUFBWCxDQUFzQjtBQUNsQkMsSUFBQUEsUUFBUSxFQUFFLElBRFE7QUFFbEJILElBQUFBLEtBQUssRUFBRTtBQUZXLEdBQXRCLENBREo7QUFPQSxPQUFLSSxLQUFMO0FBQ0gsQzs7ZUEyRlVqRCxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNob2tpZGFyLCB7IEZTV2F0Y2hlciB9IGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBodHRwUHJveHlNaWRkbGUgZnJvbSAnaHR0cC1wcm94eS1taWRkbGV3YXJlJztcbmltcG9ydCB7IGRlYWxQYXRoLCBjcmVhdGVNb2NrSGFuZGxlciwgd2luUGF0aCwgd2Fybiwgd2FybmJnLCBlcnJvciwgZXJyb3JiZywganVkZ2UgfSBmcm9tICcuL3V0aWxzL3Rvb2xzJztcblxuY29uc3QgRE1UQUcgPSAoLi4uYXJnOiBhbnlbXSkgPT4gYXJnWzJdKCk7XG5cbmNvbnN0IHJlcXVpcmVGaWxlID0gKGZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIGxldCBjb3VudDogYW55ID0ge307XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5yZWR1Y2UoKHIsIHYpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVxdWlyZSh2KTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnRba2V5XSA9IFsuLi4oY291bnRba2V5XSB8fCBbXSksIHZdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtlcnJvcmJnKGAgJHt2fSBgKX0g5paH5Lu25qC85byP5LiN56ym5ZCI6KaB5rGC77yM5bey6L+H5ruk77yBYCk7XG5cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgT2JqZWN0LmVudHJpZXMoY291bnQpXG4gICAgICAgIC5maWx0ZXIoKFtrLCB2XTogYW55KSA9PiB2Lmxlbmd0aCA+IDEpXG4gICAgICAgIC5mb3JFYWNoKChbaywgdl06IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoayk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBjaGFsay5iZ1llbGxvdyhjaGFsay53aGl0ZShgJHttZXRob2R9YCkpLFxuICAgICAgICAgICAgICAgIGNoYWxrLnllbGxvdyhwYXRoKSxcbiAgICAgICAgICAgICAgICAn5Ye6546w5qyh5pWw77yaJyxcbiAgICAgICAgICAgICAgICBlcnJvcmJnKGNoYWxrLmJvbGQodi5sZW5ndGgpKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2LmZvckVhY2goKG86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgICR7d2FybmJnKG8pfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRtT3B0aW9ucyB7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgd2F0Y2hUYXJnZXQ6IHN0cmluZyB8IHN0cmluZ1tdO1xufVxuY2xhc3MgRE0ge1xuICAgIHByaXZhdGUgdGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHdhdGNoVGFyZ2V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIHByaXZhdGUgYXBpZG9jVGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGluZGV4QXJyOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgc2VydmVyOiBhbnk7XG4gICAgcHJpdmF0ZSB3YXRjaGVyOiBGU1dhdGNoZXIgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHNlcnZlcjogYW55LCB7IHRhcmdldCwgd2F0Y2hUYXJnZXQgPSBbXSB9OiBJZG1PcHRpb25zKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy53YXRjaFRhcmdldCA9IEFycmF5LmlzQXJyYXkod2F0Y2hUYXJnZXQpID8gd2F0Y2hUYXJnZXQgOiBbd2F0Y2hUYXJnZXRdO1xuXG4gICAgICAgIHNlcnZlci51c2UoYm9keVBhcnNlci5qc29uKHsgbGltaXQ6ICc1bWInLCBzdHJpY3Q6IGZhbHNlIH0pKTtcbiAgICAgICAgc2VydmVyLnVzZShcbiAgICAgICAgICAgIGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7XG4gICAgICAgICAgICAgICAgZXh0ZW5kZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbGltaXQ6ICc1bWInLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIGNyZWF0ZVdhdGNoZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMud2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKFt0aGlzLnRhcmdldCwgLi4udGhpcy53YXRjaFRhcmdldF0sIHtcbiAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVkOiAvKF58W1xcL1xcXFxdKVxcLi4qKD88IVxcLmpzKSQvLCAvL+W/veeVpeeCueaWh+S7tlxuICAgICAgICAgICAgY3dkOiAnLicsIC8v6KGo56S65b2T5YmN55uu5b2VXG4gICAgICAgICAgICBkZXB0aDogOTksIC8v5Yiw5L2N5LqGLi4uLlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YXRjaGVyLm9uKCdjaGFuZ2UnLCBwYXRoID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdhcm5iZygnRE0nKSwgd2FybignQ0hBTkdFRCcpLCBwYXRoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFNlcnZlcigpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g5riF6Zmk57yT5a2YXG4gICAgY2xlYXJDYWNoZSA9ICgpID0+IHtcbiAgICAgICAgLy8g5Yig6Zmk5pen55qEbW9ja1xuICAgICAgICBpZiAodGhpcy5pbmRleEFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnNwbGljZShtaW4sIG1heCAtIG1pbiArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXMocmVxdWlyZS5jYWNoZSkuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgICAgIGlmIChbLi4udGhpcy53YXRjaFRhcmdldCwgdGhpcy50YXJnZXRdLnNvbWUodiA9PiBmaWxlLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yKCdEZWxldGUgQ2FjaGUnKSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbZmlsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBiaW5kU2VydmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IHRoaXMudGFyZ2V0O1xuXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgIC8vIOazqOWFpXN0b3JlXG4gICAgICAgIChnbG9iYWwgYXMgYW55KS5ETSA9IHJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvLiouanMnKSk7XG5cbiAgICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cbiAgICAgICAgYXBwLnVzZShETVRBRyk7XG4gICAgICAgIC8vIOa3u+WKoOi3r+eUsVxuICAgICAgICBPYmplY3QuZW50cmllcyhyZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLyEoLikqLmpzJykpKS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoa2V5KTtcblxuICAgICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgICAgICBpZiAocGF0aCAmJiBtZXRob2QgJiYgL15cXC8vLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICBqdWRnZSghYXBwW21ldGhvZF0sIGBtZXRob2Qgb2YgJHtrZXl9IGlzIG5vdCB2YWxpZGApO1xuICAgICAgICAgICAgICAgIGp1ZGdlKFxuICAgICAgICAgICAgICAgICAgICAhKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBgbW9jayB2YWx1ZSBvZiAke3dhcm4oa2V5KX0gc2hvdWxkIGJlIGZ1bmN0aW9uIG9yIG9iamVjdCBvciBzdHJpbmcsIGJ1dCBnb3QgJHtlcnJvcih0eXBlb2YgZm4pfWAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51c2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwoLitcXCkvLnRlc3QocGF0aCkgPyBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKSA6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUHJveHlNaWRkbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhdGhuYW1lLCByZXE6IGFueSkgPT4gKG1ldGhvZCA/IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gbWV0aG9kLnRvTG93ZXJDYXNlKCkgOiB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogd2luUGF0aChmbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJbbWV0aG9kXShwYXRoLCBjcmVhdGVNb2NrSGFuZGxlcihmbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIHRoaXMuaW5kZXhBcnIgPSB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnJlZHVjZShcbiAgICAgICAgICAgIChyOiBudW1iZXJbXSwgeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0sIGluZGV4OiBudW1iZXIpID0+IChuYW1lID09PSBETVRBRy5uYW1lID8gWy4uLnIsIGluZGV4XSA6IHIpLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERNO1xuIl19