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

  _defineProperty(this, "createWatcher", function () {
    var watcher = _chokidar["default"].watch([_this.target].concat(_toConsumableArray(_this.watchTarget)), {
      persistent: true,
      ignored: /(^|[\/\\])\..*(?<!\.js)$/,
      //忽略点文件
      cwd: '.',
      //表示当前目录
      depth: 99 //到位了....

    });

    watcher.on('change', function (path) {
      console.log((0, _tools.warnbg)('DM'), (0, _tools.warn)('CHANGED'), path); // 删除旧的mock

      if (_this.indexArr.length) {
        var min = Math.min.apply(Math, _toConsumableArray(_this.indexArr));
        var max = Math.max.apply(Math, _toConsumableArray(_this.indexArr));

        _this.server._router.stack.splice(min, max - min + 1);
      }

      _this.bindServer();
    });
  });

  _defineProperty(this, "clearCache", function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJ3YXRjaGVyIiwiY2hva2lkYXIiLCJ3YXRjaCIsInBlcnNpc3RlbnQiLCJpZ25vcmVkIiwiY3dkIiwiZGVwdGgiLCJvbiIsImluZGV4QXJyIiwibWluIiwiTWF0aCIsIm1heCIsIl9yb3V0ZXIiLCJzdGFjayIsInNwbGljZSIsImJpbmRTZXJ2ZXIiLCJrZXlzIiwiY2FjaGUiLCJmaWxlIiwic29tZSIsImluY2x1ZGVzIiwiZGIiLCJhcHAiLCJjbGVhckNhY2hlIiwidXNlIiwiZ2xvYiIsInN5bmMiLCJ0ZXN0IiwiUmVnRXhwIiwicGF0aG5hbWUiLCJyZXEiLCJ0b0xvd2VyQ2FzZSIsImluZGV4IiwibmFtZSIsImNyZWF0ZVdhdGNoZXIiLCJlIiwiQXJyYXkiLCJpc0FycmF5IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRO0FBQUEsb0NBQUlDLEdBQUo7QUFBSUEsSUFBQUEsR0FBSjtBQUFBOztBQUFBLFNBQW1CQSxHQUFHLENBQUMsQ0FBRCxDQUFILEVBQW5CO0FB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LENBQTlEO0FBRUFGLEVBQUFBLE1BQU0sQ0FBQzJCLEdBQVAsQ0FBV2MsdUJBQVdDLElBQVgsQ0FBZ0I7QUFBRUMsSUFBQUEsS0FBSyxFQUFFLEtBQVQ7QUFBZ0JDLElBQUFBLE1BQU0sRUFBRTtBQUF4QixHQUFoQixDQUFYO0FBQ0E1QyxFQUFBQSxNQUFNLENBQUMyQixHQUFQLENBQ0ljLHVCQUFXSSxVQUFYLENBQXNCO0FBQ2xCQyxJQUFBQSxRQUFRLEVBQUUsSUFEUTtBQUVsQkgsSUFBQUEsS0FBSyxFQUFFO0FBRlcsR0FBdEIsQ0FESjtBQU9BLE9BQUtJLEtBQUw7QUFDSCxDOztlQTRGVWhELEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hva2lkYXIgZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGh0dHBQcm94eU1pZGRsZSBmcm9tICdodHRwLXByb3h5LW1pZGRsZXdhcmUnO1xuaW1wb3J0IHsgZGVhbFBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyLCB3aW5QYXRoLCB3YXJuLCB3YXJuYmcsIGVycm9yLCBlcnJvcmJnLCBqdWRnZSB9IGZyb20gJy4vdXRpbHMvdG9vbHMnO1xuXG5jb25zdCBETVRBRyA9ICguLi5hcmc6IGFueVtdKSA9PiBhcmdbMl0oKTtcblxuY29uc3QgcmVxdWlyZUZpbGUgPSAoZmlsZXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgbGV0IGNvdW50OiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLnJlZHVjZSgociwgdikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXF1aXJlKHYpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVzdWx0KS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudFtrZXldID0gWy4uLihjb3VudFtrZXldIHx8IFtdKSwgdl07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5yLFxuICAgICAgICAgICAgICAgIC4uLih0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2Vycm9yYmcoYCAke3Z9IGApfSDmlofku7bmoLzlvI/kuI3nrKblkIjopoHmsYLvvIzlt7Lov4fmu6TvvIFgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9LCB7fSk7XG5cbiAgICBPYmplY3QuZW50cmllcyhjb3VudClcbiAgICAgICAgLmZpbHRlcigoW2ssIHZdOiBhbnkpID0+IHYubGVuZ3RoID4gMSlcbiAgICAgICAgLmZvckVhY2goKFtrLCB2XTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGNoYWxrLmJnWWVsbG93KGNoYWxrLndoaXRlKGAke21ldGhvZH1gKSksXG4gICAgICAgICAgICAgICAgY2hhbGsueWVsbG93KHBhdGgpLFxuICAgICAgICAgICAgICAgICflh7rnjrDmrKHmlbDvvJonLFxuICAgICAgICAgICAgICAgIGVycm9yYmcoY2hhbGsuYm9sZCh2Lmxlbmd0aCkpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHYuZm9yRWFjaCgobzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgJHt3YXJuYmcobyl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJZG1PcHRpb25zIHtcbiAgICB0YXJnZXQ6IHN0cmluZztcbiAgICB3YXRjaFRhcmdldDogc3RyaW5nO1xufVxuY2xhc3MgRE0ge1xuICAgIHByaXZhdGUgdGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHdhdGNoVGFyZ2V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIHByaXZhdGUgYXBpZG9jVGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGluZGV4QXJyOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgc2VydmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGFueSwgeyB0YXJnZXQsIHdhdGNoVGFyZ2V0IH06IElkbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLndhdGNoVGFyZ2V0ID0gQXJyYXkuaXNBcnJheSh3YXRjaFRhcmdldCkgPyB3YXRjaFRhcmdldCA6IFt3YXRjaFRhcmdldF07XG5cbiAgICAgICAgc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzVtYicsIHN0cmljdDogZmFsc2UgfSkpO1xuICAgICAgICBzZXJ2ZXIudXNlKFxuICAgICAgICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgICAgICAgICBleHRlbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogJzVtYicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlV2F0Y2hlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKFt0aGlzLnRhcmdldCwgLi4udGhpcy53YXRjaFRhcmdldF0sIHtcbiAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVkOiAvKF58W1xcL1xcXFxdKVxcLi4qKD88IVxcLmpzKSQvLCAvL+W/veeVpeeCueaWh+S7tlxuICAgICAgICAgICAgY3dkOiAnLicsIC8v6KGo56S65b2T5YmN55uu5b2VXG4gICAgICAgICAgICBkZXB0aDogOTksIC8v5Yiw5L2N5LqGLi4uLlxuICAgICAgICB9KTtcbiAgICAgICAgd2F0Y2hlci5vbignY2hhbmdlJywgcGF0aCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh3YXJuYmcoJ0RNJyksIHdhcm4oJ0NIQU5HRUQnKSwgcGF0aCk7XG5cbiAgICAgICAgICAgIC8vIOWIoOmZpOaXp+eahG1vY2tcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4QXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnRoaXMuaW5kZXhBcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2suc3BsaWNlKG1pbiwgbWF4IC0gbWluICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYmluZFNlcnZlcigpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g5riF6Zmk57yT5a2YXG4gICAgY2xlYXJDYWNoZSA9ICgpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMocmVxdWlyZS5jYWNoZSkuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgICAgIGlmIChbLi4udGhpcy53YXRjaFRhcmdldCwgdGhpcy50YXJnZXRdLnNvbWUodiA9PiBmaWxlLmluY2x1ZGVzKHYpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKCdEZWxldGUgQ2FjaGUnKSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbZmlsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBiaW5kU2VydmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IHRoaXMudGFyZ2V0O1xuXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgIC8vIOazqOWFpXN0b3JlXG4gICAgICAgIC8vIGdsb2JhbC5ETSA9IHJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvLiouanMnKSk7XG5cbiAgICAgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cbiAgICAgICAgYXBwLnVzZShETVRBRyk7XG4gICAgICAgIC8vIOa3u+WKoOi3r+eUsVxuICAgICAgICBPYmplY3QuZW50cmllcyhyZXF1aXJlRmlsZShnbG9iLnN5bmMoZGIgKyAnLyEoLikqLmpzJykpKS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoa2V5KTtcblxuICAgICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgICAgICBpZiAocGF0aCAmJiBtZXRob2QgJiYgL15cXC8vLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICBqdWRnZSghYXBwW21ldGhvZF0sIGBtZXRob2Qgb2YgJHtrZXl9IGlzIG5vdCB2YWxpZGApO1xuICAgICAgICAgICAgICAgIGp1ZGdlKFxuICAgICAgICAgICAgICAgICAgICAhKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBgbW9jayB2YWx1ZSBvZiAke3dhcm4oa2V5KX0gc2hvdWxkIGJlIGZ1bmN0aW9uIG9yIG9iamVjdCBvciBzdHJpbmcsIGJ1dCBnb3QgJHtlcnJvcih0eXBlb2YgZm4pfWAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51c2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwoLitcXCkvLnRlc3QocGF0aCkgPyBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKSA6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUHJveHlNaWRkbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhdGhuYW1lLCByZXE6IGFueSkgPT4gKG1ldGhvZCA/IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gbWV0aG9kLnRvTG93ZXJDYXNlKCkgOiB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogd2luUGF0aChmbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJbbWV0aG9kXShwYXRoLCBjcmVhdGVNb2NrSGFuZGxlcihmbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIHRoaXMuaW5kZXhBcnIgPSB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnJlZHVjZShcbiAgICAgICAgICAgIChyOiBudW1iZXJbXSwgeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0sIGluZGV4OiBudW1iZXIpID0+IChuYW1lID09PSBETVRBRy5uYW1lID8gWy4uLnIsIGluZGV4XSA6IHIpLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERNO1xuIl19