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
      watchTarget = _ref7.watchTarget;

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
        console.log((0, _tools.error)('Delete Cache'), file);
        delete require.cache[file];
      }
    });
  });

  _defineProperty(this, "bindServer", function () {
    var db = _this.target;
    var app = _this.server; // 注入store
    // global.DM = requireFile(glob.sync(db + '/.*.js'));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJ3YXRjaGVyIiwiY2hva2lkYXIiLCJ3YXRjaCIsInBlcnNpc3RlbnQiLCJpZ25vcmVkIiwiY3dkIiwiZGVwdGgiLCJvbiIsImJpbmRTZXJ2ZXIiLCJpbmRleEFyciIsIm1pbiIsIk1hdGgiLCJtYXgiLCJfcm91dGVyIiwic3RhY2siLCJzcGxpY2UiLCJrZXlzIiwiY2FjaGUiLCJmaWxlIiwic29tZSIsImluY2x1ZGVzIiwiZGIiLCJhcHAiLCJjbGVhckNhY2hlIiwidXNlIiwiZ2xvYiIsInN5bmMiLCJ0ZXN0IiwiUmVnRXhwIiwicGF0aG5hbWUiLCJyZXEiLCJ0b0xvd2VyQ2FzZSIsImluZGV4IiwibmFtZSIsImNyZWF0ZVdhdGNoZXIiLCJlIiwiQXJyYXkiLCJpc0FycmF5IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRO0FBQUEsb0NBQUlDLEdBQUo7QUFBSUEsSUFBQUEsR0FBSjtBQUFBOztBQUFBLFNBQW1CQSxHQUFHLENBQUMsQ0FBRCxDQUFILEVBQW5CO0FB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V0FBZCxJQUE2QkEsV0FBN0IsR0FBMkMsQ0FBQ0EsV0FBRCxDQUE5RDtBQUVBRixFQUFBQSxNQUFNLENBQUMyQixHQUFQLENBQVdjLHVCQUFXQyxJQUFYLENBQWdCO0FBQUVDLElBQUFBLEtBQUssRUFBRSxLQUFUO0FBQWdCQyxJQUFBQSxNQUFNLEVBQUU7QUFBeEIsR0FBaEIsQ0FBWDtBQUNBNUMsRUFBQUEsTUFBTSxDQUFDMkIsR0FBUCxDQUNJYyx1QkFBV0ksVUFBWCxDQUFzQjtBQUNsQkMsSUFBQUEsUUFBUSxFQUFFLElBRFE7QUFFbEJILElBQUFBLEtBQUssRUFBRTtBQUZXLEdBQXRCLENBREo7QUFPQSxPQUFLSSxLQUFMO0FBQ0gsQzs7ZUEyRlVoRCxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNob2tpZGFyLCB7IEZTV2F0Y2hlciB9IGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBodHRwUHJveHlNaWRkbGUgZnJvbSAnaHR0cC1wcm94eS1taWRkbGV3YXJlJztcbmltcG9ydCB7IGRlYWxQYXRoLCBjcmVhdGVNb2NrSGFuZGxlciwgd2luUGF0aCwgd2Fybiwgd2FybmJnLCBlcnJvciwgZXJyb3JiZywganVkZ2UgfSBmcm9tICcuL3V0aWxzL3Rvb2xzJztcblxuY29uc3QgRE1UQUcgPSAoLi4uYXJnOiBhbnlbXSkgPT4gYXJnWzJdKCk7XG5cbmNvbnN0IHJlcXVpcmVGaWxlID0gKGZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIGxldCBjb3VudDogYW55ID0ge307XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5yZWR1Y2UoKHIsIHYpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVxdWlyZSh2KTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnRba2V5XSA9IFsuLi4oY291bnRba2V5XSB8fCBbXSksIHZdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtlcnJvcmJnKGAgJHt2fSBgKX0g5paH5Lu25qC85byP5LiN56ym5ZCI6KaB5rGC77yM5bey6L+H5ruk77yBYCk7XG5cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgT2JqZWN0LmVudHJpZXMoY291bnQpXG4gICAgICAgIC5maWx0ZXIoKFtrLCB2XTogYW55KSA9PiB2Lmxlbmd0aCA+IDEpXG4gICAgICAgIC5mb3JFYWNoKChbaywgdl06IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoayk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBjaGFsay5iZ1llbGxvdyhjaGFsay53aGl0ZShgJHttZXRob2R9YCkpLFxuICAgICAgICAgICAgICAgIGNoYWxrLnllbGxvdyhwYXRoKSxcbiAgICAgICAgICAgICAgICAn5Ye6546w5qyh5pWw77yaJyxcbiAgICAgICAgICAgICAgICBlcnJvcmJnKGNoYWxrLmJvbGQodi5sZW5ndGgpKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2LmZvckVhY2goKG86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgICR7d2FybmJnKG8pfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRtT3B0aW9ucyB7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgd2F0Y2hUYXJnZXQ6IHN0cmluZztcbn1cbmNsYXNzIERNIHtcbiAgICBwcml2YXRlIHRhcmdldDogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSB3YXRjaFRhcmdldDogc3RyaW5nW10gPSBbXTtcbiAgICBwcml2YXRlIGFwaWRvY1RhcmdldDogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBpbmRleEFycjogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHNlcnZlcjogYW55O1xuICAgIHByaXZhdGUgd2F0Y2hlcjogRlNXYXRjaGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGFueSwgeyB0YXJnZXQsIHdhdGNoVGFyZ2V0IH06IElkbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLndhdGNoVGFyZ2V0ID0gQXJyYXkuaXNBcnJheSh3YXRjaFRhcmdldCkgPyB3YXRjaFRhcmdldCA6IFt3YXRjaFRhcmdldF07XG5cbiAgICAgICAgc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzVtYicsIHN0cmljdDogZmFsc2UgfSkpO1xuICAgICAgICBzZXJ2ZXIudXNlKFxuICAgICAgICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgICAgICAgICBleHRlbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogJzVtYicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlV2F0Y2hlciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy53YXRjaGVyID0gY2hva2lkYXIud2F0Y2goW3RoaXMudGFyZ2V0LCAuLi50aGlzLndhdGNoVGFyZ2V0XSwge1xuICAgICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICAgICAgICAgIGlnbm9yZWQ6IC8oXnxbXFwvXFxcXF0pXFwuLiooPzwhXFwuanMpJC8sIC8v5b+955Wl54K55paH5Lu2XG4gICAgICAgICAgICBjd2Q6ICcuJywgLy/ooajnpLrlvZPliY3nm67lvZVcbiAgICAgICAgICAgIGRlcHRoOiA5OSwgLy/liLDkvY3kuoYuLi4uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndhdGNoZXIub24oJ2NoYW5nZScsIHBhdGggPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cod2FybmJnKCdETScpLCB3YXJuKCdDSEFOR0VEJyksIHBhdGgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kU2VydmVyKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDmuIXpmaTnvJPlrZhcbiAgICBjbGVhckNhY2hlID0gKCkgPT4ge1xuICAgICAgICAvLyDliKDpmaTml6fnmoRtb2NrXG4gICAgICAgIGlmICh0aGlzLmluZGV4QXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50aGlzLmluZGV4QXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2suc3BsaWNlKG1pbiwgbWF4IC0gbWluICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyhyZXF1aXJlLmNhY2hlKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKFsuLi50aGlzLndhdGNoVGFyZ2V0LCB0aGlzLnRhcmdldF0uc29tZSh2ID0+IGZpbGUuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IoJ0RlbGV0ZSBDYWNoZScpLCBmaWxlKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtmaWxlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGJpbmRTZXJ2ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRiID0gdGhpcy50YXJnZXQ7XG5cbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5zZXJ2ZXI7XG5cbiAgICAgICAgLy8g5rOo5YWlc3RvcmVcbiAgICAgICAgLy8gZ2xvYmFsLkRNID0gcmVxdWlyZUZpbGUoZ2xvYi5zeW5jKGRiICsgJy8uKi5qcycpKTtcblxuICAgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblxuICAgICAgICBhcHAudXNlKERNVEFHKTtcbiAgICAgICAgLy8g5re75Yqg6Lev55SxXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvISguKSouanMnKSkpLmZvckVhY2goKFtrZXksIGZuXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrZXkpO1xuXG4gICAgICAgICAgICAvLyDpnZ7mnKzlnLDot6/lvoTov4fmu6RcbiAgICAgICAgICAgIGlmIChwYXRoICYmIG1ldGhvZCAmJiAvXlxcLy8udGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgIGp1ZGdlKCFhcHBbbWV0aG9kXSwgYG1ldGhvZCBvZiAke2tleX0gaXMgbm90IHZhbGlkYCk7XG4gICAgICAgICAgICAgICAganVkZ2UoXG4gICAgICAgICAgICAgICAgICAgICEodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBmbiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGZuID09PSAnc3RyaW5nJyksXG4gICAgICAgICAgICAgICAgICAgIGBtb2NrIHZhbHVlIG9mICR7d2FybihrZXkpfSBzaG91bGQgYmUgZnVuY3Rpb24gb3Igb2JqZWN0IG9yIHN0cmluZywgYnV0IGdvdCAke2Vycm9yKHR5cGVvZiBmbil9YCxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLnVzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIC9cXCguK1xcKS8udGVzdChwYXRoKSA/IG5ldyBSZWdFeHAoYF4ke3BhdGh9JGApIDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBQcm94eU1pZGRsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGF0aG5hbWUsIHJlcTogYW55KSA9PiAobWV0aG9kID8gcmVxLm1ldGhvZC50b0xvd2VyQ2FzZSgpID09PSBtZXRob2QudG9Mb3dlckNhc2UoKSA6IHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB3aW5QYXRoKGZuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZlclttZXRob2RdKHBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyKGZuKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwLnVzZShETVRBRyk7XG5cbiAgICAgICAgdGhpcy5pbmRleEFyciA9IHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2sucmVkdWNlKFxuICAgICAgICAgICAgKHI6IG51bWJlcltdLCB7IG5hbWUgfTogeyBuYW1lOiBzdHJpbmcgfSwgaW5kZXg6IG51bWJlcikgPT4gKG5hbWUgPT09IERNVEFHLm5hbWUgPyBbLi4uciwgaW5kZXhdIDogciksXG4gICAgICAgICAgICBbXSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgc3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFNlcnZlcigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICAgICAgICAvLyBvdXRwdXRFcnJvcihlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlV2F0Y2hlcigpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRE07XG4iXX0=