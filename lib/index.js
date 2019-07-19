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
    // global.DM = requireFile(glob.sync(db + '/.*.js'));

    _this.clearCache();

    app.use(DMTAG); // 添加路由

    Object.entries(requireFile(_glob["default"].sync(db + '/!(.|/)*.js'))).forEach(function (_ref8) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJ3YXRjaGVyIiwiY2hva2lkYXIiLCJ3YXRjaCIsInBlcnNpc3RlbnQiLCJpZ25vcmVkIiwiY3dkIiwiZGVwdGgiLCJvbiIsImJpbmRTZXJ2ZXIiLCJpbmRleEFyciIsIm1pbiIsIk1hdGgiLCJtYXgiLCJfcm91dGVyIiwic3RhY2siLCJzcGxpY2UiLCJrZXlzIiwiY2FjaGUiLCJmaWxlIiwic29tZSIsImluY2x1ZGVzIiwiZGIiLCJhcHAiLCJjbGVhckNhY2hlIiwidXNlIiwiZ2xvYiIsInN5bmMiLCJ0ZXN0IiwiUmVnRXhwIiwicGF0aG5hbWUiLCJyZXEiLCJ0b0xvd2VyQ2FzZSIsImluZGV4IiwibmFtZSIsImNyZWF0ZVdhdGNoZXIiLCJlIiwiQXJyYXkiLCJpc0FycmF5IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRO0FBQUEsb0NBQUlDLEdBQUo7QUFBSUEsSUFBQUEsR0FBSjtBQUFBOztBQUFBLFNBQW1CQSxHQUFHLENBQUMsQ0FBRCxDQUFILEVBQW5CO0FB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O0FBRUFGLEVBQUFBLE1BQU0sQ0FBQzJCLEdBQVAsQ0FBV2MsdUJBQVdDLElBQVgsQ0FBZ0I7QUFBRUMsSUFBQUEsS0FBSyxFQUFFLEtBQVQ7QUFBZ0JDLElBQUFBLE1BQU0sRUFBRTtBQUF4QixHQUFoQixDQUFYO0FBQ0E1QyxFQUFBQSxNQUFNLENBQUMyQixHQUFQLENBQ0ljLHVCQUFXSSxVQUFYLENBQXNCO0FBQ2xCQyxJQUFBQSxRQUFRLEVBQUUsSUFEUTtBQUVsQkgsSUFBQUEsS0FBSyxFQUFFO0FBRlcsR0FBdEIsQ0FESjtBQU9BLE9BQUtJLEtBQUw7QUFDSCxDOztlQTJGVWhELEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hva2lkYXIsIHsgRlNXYXRjaGVyIH0gZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGh0dHBQcm94eU1pZGRsZSBmcm9tICdodHRwLXByb3h5LW1pZGRsZXdhcmUnO1xuaW1wb3J0IHsgZGVhbFBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyLCB3aW5QYXRoLCB3YXJuLCB3YXJuYmcsIGVycm9yLCBlcnJvcmJnLCBqdWRnZSB9IGZyb20gJy4vdXRpbHMvdG9vbHMnO1xuXG5jb25zdCBETVRBRyA9ICguLi5hcmc6IGFueVtdKSA9PiBhcmdbMl0oKTtcblxuY29uc3QgcmVxdWlyZUZpbGUgPSAoZmlsZXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgbGV0IGNvdW50OiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLnJlZHVjZSgociwgdikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXF1aXJlKHYpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVzdWx0KS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudFtrZXldID0gWy4uLihjb3VudFtrZXldIHx8IFtdKSwgdl07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5yLFxuICAgICAgICAgICAgICAgIC4uLih0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2Vycm9yYmcoYCAke3Z9IGApfSDmlofku7bmoLzlvI/kuI3nrKblkIjopoHmsYLvvIzlt7Lov4fmu6TvvIFgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9LCB7fSk7XG5cbiAgICBPYmplY3QuZW50cmllcyhjb3VudClcbiAgICAgICAgLmZpbHRlcigoW2ssIHZdOiBhbnkpID0+IHYubGVuZ3RoID4gMSlcbiAgICAgICAgLmZvckVhY2goKFtrLCB2XTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGNoYWxrLmJnWWVsbG93KGNoYWxrLndoaXRlKGAke21ldGhvZH1gKSksXG4gICAgICAgICAgICAgICAgY2hhbGsueWVsbG93KHBhdGgpLFxuICAgICAgICAgICAgICAgICflh7rnjrDmrKHmlbDvvJonLFxuICAgICAgICAgICAgICAgIGVycm9yYmcoY2hhbGsuYm9sZCh2Lmxlbmd0aCkpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHYuZm9yRWFjaCgobzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgJHt3YXJuYmcobyl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJZG1PcHRpb25zIHtcbiAgICB0YXJnZXQ6IHN0cmluZztcbiAgICB3YXRjaFRhcmdldDogc3RyaW5nIHwgc3RyaW5nW107XG59XG5jbGFzcyBETSB7XG4gICAgcHJpdmF0ZSB0YXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgd2F0Y2hUYXJnZXQ6IHN0cmluZ1tdID0gW107XG4gICAgcHJpdmF0ZSBhcGlkb2NUYXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgaW5kZXhBcnI6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSBzZXJ2ZXI6IGFueTtcbiAgICBwcml2YXRlIHdhdGNoZXI6IEZTV2F0Y2hlciB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBhbnksIHsgdGFyZ2V0LCB3YXRjaFRhcmdldCA9IFtdIH06IElkbU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLndhdGNoVGFyZ2V0ID0gQXJyYXkuaXNBcnJheSh3YXRjaFRhcmdldCkgPyB3YXRjaFRhcmdldCA6IFt3YXRjaFRhcmdldF07XG5cbiAgICAgICAgc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzVtYicsIHN0cmljdDogZmFsc2UgfSkpO1xuICAgICAgICBzZXJ2ZXIudXNlKFxuICAgICAgICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgICAgICAgICBleHRlbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogJzVtYicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlV2F0Y2hlciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy53YXRjaGVyID0gY2hva2lkYXIud2F0Y2goW3RoaXMudGFyZ2V0LCAuLi50aGlzLndhdGNoVGFyZ2V0XSwge1xuICAgICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICAgICAgICAgIGlnbm9yZWQ6IC8oXnxbXFwvXFxcXF0pXFwuLiooPzwhXFwuanMpJC8sIC8v5b+955Wl54K55paH5Lu2XG4gICAgICAgICAgICBjd2Q6ICcuJywgLy/ooajnpLrlvZPliY3nm67lvZVcbiAgICAgICAgICAgIGRlcHRoOiA5OSwgLy/liLDkvY3kuoYuLi4uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndhdGNoZXIub24oJ2NoYW5nZScsIHBhdGggPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cod2FybmJnKCdETScpLCB3YXJuKCdDSEFOR0VEJyksIHBhdGgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kU2VydmVyKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDmuIXpmaTnvJPlrZhcbiAgICBjbGVhckNhY2hlID0gKCkgPT4ge1xuICAgICAgICAvLyDliKDpmaTml6fnmoRtb2NrXG4gICAgICAgIGlmICh0aGlzLmluZGV4QXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50aGlzLmluZGV4QXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2suc3BsaWNlKG1pbiwgbWF4IC0gbWluICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyhyZXF1aXJlLmNhY2hlKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKFsuLi50aGlzLndhdGNoVGFyZ2V0LCB0aGlzLnRhcmdldF0uc29tZSh2ID0+IGZpbGUuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyb3IoJ0RlbGV0ZSBDYWNoZScpLCBmaWxlKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtmaWxlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGJpbmRTZXJ2ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRiID0gdGhpcy50YXJnZXQ7XG5cbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5zZXJ2ZXI7XG5cbiAgICAgICAgLy8g5rOo5YWlc3RvcmVcbiAgICAgICAgLy8gZ2xvYmFsLkRNID0gcmVxdWlyZUZpbGUoZ2xvYi5zeW5jKGRiICsgJy8uKi5qcycpKTtcblxuICAgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblxuICAgICAgICBhcHAudXNlKERNVEFHKTtcbiAgICAgICAgLy8g5re75Yqg6Lev55SxXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvISgufC8pKi5qcycpKSkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBbcGF0aCwgbWV0aG9kXSA9IGRlYWxQYXRoKGtleSk7XG5cbiAgICAgICAgICAgIC8vIOmdnuacrOWcsOi3r+W+hOi/h+a7pFxuICAgICAgICAgICAgaWYgKHBhdGggJiYgbWV0aG9kICYmIC9eXFwvLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgICAgICAganVkZ2UoIWFwcFttZXRob2RdLCBgbWV0aG9kIG9mICR7a2V5fSBpcyBub3QgdmFsaWRgKTtcbiAgICAgICAgICAgICAgICBqdWRnZShcbiAgICAgICAgICAgICAgICAgICAgISh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGZuID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgYG1vY2sgdmFsdWUgb2YgJHt3YXJuKGtleSl9IHNob3VsZCBiZSBmdW5jdGlvbiBvciBvYmplY3Qgb3Igc3RyaW5nLCBidXQgZ290ICR7ZXJyb3IodHlwZW9mIGZuKX1gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBhcHAudXNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgL1xcKC4rXFwpLy50ZXN0KHBhdGgpID8gbmV3IFJlZ0V4cChgXiR7cGF0aH0kYCkgOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cFByb3h5TWlkZGxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXRobmFtZSwgcmVxOiBhbnkpID0+IChtZXRob2QgPyByZXEubWV0aG9kLnRvTG93ZXJDYXNlKCkgPT09IG1ldGhvZC50b0xvd2VyQ2FzZSgpIDogdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHdpblBhdGgoZm4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyW21ldGhvZF0ocGF0aCwgY3JlYXRlTW9ja0hhbmRsZXIoZm4pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudXNlKERNVEFHKTtcblxuICAgICAgICB0aGlzLmluZGV4QXJyID0gdGhpcy5zZXJ2ZXIuX3JvdXRlci5zdGFjay5yZWR1Y2UoXG4gICAgICAgICAgICAocjogbnVtYmVyW10sIHsgbmFtZSB9OiB7IG5hbWU6IHN0cmluZyB9LCBpbmRleDogbnVtYmVyKSA9PiAobmFtZSA9PT0gRE1UQUcubmFtZSA/IFsuLi5yLCBpbmRleF0gOiByKSxcbiAgICAgICAgICAgIFtdLFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBzdGFydCA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV2F0Y2hlcigpO1xuICAgICAgICAgICAgdGhpcy5iaW5kU2VydmVyKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgICAgICAgIC8vIG91dHB1dEVycm9yKGUpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBETTtcbiJdfQ==