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

    console.log('==========');

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
      console.log(JSON.stringify((0, _parse.createObject)(v.success.fields['Success 200'])));
      return _objectSpread({}, r, _defineProperty({}, "".concat(v.type, " ").concat(v.url), (0, _parse.createObject)(v.success.fields['Success 200'])));
    }, {});
    console.log(b);
    app.use(DMTAG);
    var mockData = Object.entries(_objectSpread({}, requireFile(_glob["default"].sync(db + '/!(.)*.js')), {}, b)); // 添加路由

    [].concat(_toConsumableArray(mockData), []).forEach(function (_ref8) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJETVRBRyIsImFyZyIsInJlcXVpcmVGaWxlIiwiZmlsZXMiLCJjb3VudCIsInJlc3VsdCIsInJlZHVjZSIsInIiLCJ2IiwicmVxdWlyZSIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwiZm4iLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJjaGFsayIsImJnWWVsbG93Iiwid2hpdGUiLCJ5ZWxsb3ciLCJib2xkIiwibyIsIkRNIiwic2VydmVyIiwidGFyZ2V0Iiwid2F0Y2hUYXJnZXQiLCJwYXJzZXJzIiwid2F0Y2hlciIsImNob2tpZGFyIiwid2F0Y2giLCJwZXJzaXN0ZW50IiwiaWdub3JlZCIsImN3ZCIsImRlcHRoIiwib24iLCJiaW5kU2VydmVyIiwiaW5kZXhBcnIiLCJtaW4iLCJNYXRoIiwibWF4IiwiX3JvdXRlciIsInN0YWNrIiwic3BsaWNlIiwia2V5cyIsImNhY2hlIiwiZmlsZSIsInNvbWUiLCJpbmNsdWRlcyIsImRiIiwiYXBwIiwiZ2xvYmFsIiwiZ2xvYiIsInN5bmMiLCJjbGVhckNhY2hlIiwiYXBpZG9jIiwic2V0TG9nZ2VyIiwiZGVidWciLCJ2ZXJib3NlIiwiaW5mbyIsIndhcm4iLCJlcnJvciIsImEiLCJwYXJzZSIsInNyYyIsImFwaWRvY1BhcnNlcnMiLCJzaWxlbnQiLCJzaW11bGF0ZSIsImNvbG9yaXplIiwibWFya2Rvd24iLCJjb25maWciLCJhcGlwcml2YXRlIiwiZW5jb2RpbmciLCJiIiwiSlNPTiIsImRhdGEiLCJ1cmwiLCJzdHJpbmdpZnkiLCJzdWNjZXNzIiwiZmllbGRzIiwidHlwZSIsInVzZSIsIm1vY2tEYXRhIiwidGVzdCIsIlJlZ0V4cCIsInBhdGhuYW1lIiwicmVxIiwidG9Mb3dlckNhc2UiLCJpbmRleCIsIm5hbWUiLCJjcmVhdGVXYXRjaGVyIiwiZSIsIkFycmF5IiwiaXNBcnJheSIsImJvZHlQYXJzZXIiLCJqc29uIiwibGltaXQiLCJzdHJpY3QiLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJzdGFydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsU0FBUkEsS0FBUTtBQUFBLG9DQUFJQyxHQUFKO0FBQUlBLElBQUFBLEdBQUo7QUFBQTs7QUFBQSxTQUFtQkEsR0FBRyxDQUFDLENBQUQsQ0FBSCxFQUFuQjtBQUFBLENBQWQ7O0FBRUEsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsS0FBRCxFQUFxQjtBQUNyQyxNQUFJQyxLQUFVLEdBQUcsRUFBakI7QUFFQSxNQUFNQyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0csTUFBTixDQUFhLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ2xDLFFBQU1ILE1BQU0sR0FBR0ksT0FBTyxDQUFDRCxDQUFELENBQXRCOztBQUVBLFFBQUksUUFBT0gsTUFBUCxNQUFrQixRQUF0QixFQUFnQztBQUM1QkssTUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVOLE1BQWYsRUFBdUJPLE9BQXZCLENBQStCLGdCQUFlO0FBQUE7QUFBQSxZQUFiQyxHQUFhO0FBQUEsWUFBUkMsRUFBUTs7QUFDMUNWLFFBQUFBLEtBQUssQ0FBQ1MsR0FBRCxDQUFMLGdDQUFrQlQsS0FBSyxDQUFDUyxHQUFELENBQUwsSUFBYyxFQUFoQyxJQUFxQ0wsQ0FBckM7QUFDSCxPQUZEO0FBSUEsK0JBQ09ELENBRFAsTUFFUSxRQUFPRixNQUFQLE1BQWtCLFFBQWxCLElBQThCQSxNQUZ0QztBQUlILEtBVEQsTUFTTztBQUNIVSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsV0FBZSwrQkFBWVIsQ0FBWixPQUFmO0FBRUEsYUFBT0QsQ0FBUDtBQUNIO0FBQ0osR0FqQmMsRUFpQlosRUFqQlksQ0FBZjtBQW1CQUcsRUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVQLEtBQWYsRUFDS2EsTUFETCxDQUNZO0FBQUE7QUFBQSxRQUFFQyxDQUFGO0FBQUEsUUFBS1YsQ0FBTDs7QUFBQSxXQUFpQkEsQ0FBQyxDQUFDVyxNQUFGLEdBQVcsQ0FBNUI7QUFBQSxHQURaLEVBRUtQLE9BRkwsQ0FFYSxpQkFBaUI7QUFBQTtBQUFBLFFBQWZNLENBQWU7QUFBQSxRQUFaVixDQUFZOztBQUFBLG9CQUNELHFCQUFTVSxDQUFULENBREM7QUFBQTtBQUFBLFFBQ2pCRSxJQURpQjtBQUFBLFFBQ1hDLE1BRFc7O0FBRXRCTixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxFQUFaO0FBQ0FELElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUNJTSxrQkFBTUMsUUFBTixDQUFlRCxrQkFBTUUsS0FBTixXQUFlSCxNQUFmLEVBQWYsQ0FESixFQUVJQyxrQkFBTUcsTUFBTixDQUFhTCxJQUFiLENBRkosRUFHSSxPQUhKLEVBSUksb0JBQVFFLGtCQUFNSSxJQUFOLENBQVdsQixDQUFDLENBQUNXLE1BQWIsQ0FBUixDQUpKO0FBTUFYLElBQUFBLENBQUMsQ0FBQ0ksT0FBRixDQUFVLFVBQUNlLENBQUQsRUFBZTtBQUNyQlosTUFBQUEsT0FBTyxDQUFDQyxHQUFSLGFBQWlCLG1CQUFPVyxDQUFQLENBQWpCO0FBQ0gsS0FGRDtBQUdBWixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxFQUFaO0FBQ0gsR0FmTDtBQWlCQSxTQUFPWCxNQUFQO0FBQ0gsQ0F4Q0Q7O0lBK0NNdUIsRSxHQVNGLFlBQVlDLE1BQVosU0FBaUY7QUFBQTs7QUFBQSxNQUF0REMsTUFBc0QsU0FBdERBLE1BQXNEO0FBQUEsZ0NBQTlDQyxXQUE4QztBQUFBLE1BQTlDQSxXQUE4QyxrQ0FBaEMsRUFBZ0M7QUFBQSw0QkFBNUJDLE9BQTRCO0FBQUEsTUFBNUJBLE9BQTRCLDhCQUFsQixFQUFrQjs7QUFBQTs7QUFBQSxrQ0FSeEQsRUFRd0Q7O0FBQUEsdUNBUGpELEVBT2lEOztBQUFBLHlDQU5wRCxFQU1vRDs7QUFBQSx3Q0FMbEQsRUFLa0Q7O0FBQUEsb0NBSnZELEVBSXVEOztBQUFBOztBQUFBLG1DQUY3QyxJQUU2Qzs7QUFBQSx5Q0FrQmpFLFlBQU07QUFDbEIsSUFBQSxLQUFJLENBQUNDLE9BQUwsR0FBZUMscUJBQVNDLEtBQVQsRUFBZ0IsS0FBSSxDQUFDTCxNQUFyQiw0QkFBZ0MsS0FBSSxDQUFDQyxXQUFyQyxJQUFtRDtBQUM5REssTUFBQUEsVUFBVSxFQUFFLElBRGtEO0FBRTlEQyxNQUFBQSxPQUFPLEVBQUUsMEJBRnFEO0FBRXpCO0FBQ3JDQyxNQUFBQSxHQUFHLEVBQUUsR0FIeUQ7QUFHcEQ7QUFDVkMsTUFBQUEsS0FBSyxFQUFFLEVBSnVELENBSW5EOztBQUptRCxLQUFuRCxDQUFmOztBQU1BLElBQUEsS0FBSSxDQUFDTixPQUFMLENBQWFPLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsVUFBQXBCLElBQUksRUFBSTtBQUM5QkwsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksbUJBQU8sSUFBUCxDQUFaLEVBQTBCLGlCQUFLLFNBQUwsQ0FBMUIsRUFBMkNJLElBQTNDOztBQUNBLE1BQUEsS0FBSSxDQUFDcUIsVUFBTDtBQUNILEtBSEQ7QUFJSCxHQTdCZ0Y7O0FBQUEsc0NBZ0NwRSxZQUFNO0FBQ2Y7QUFDQSxRQUFJLEtBQUksQ0FBQ0MsUUFBTCxDQUFjdkIsTUFBbEIsRUFBMEI7QUFDdEIsVUFBTXdCLEdBQUcsR0FBR0MsSUFBSSxDQUFDRCxHQUFMLE9BQUFDLElBQUkscUJBQVEsS0FBSSxDQUFDRixRQUFiLEVBQWhCO0FBQ0EsVUFBTUcsR0FBRyxHQUFHRCxJQUFJLENBQUNDLEdBQUwsT0FBQUQsSUFBSSxxQkFBUSxLQUFJLENBQUNGLFFBQWIsRUFBaEI7O0FBQ0EsTUFBQSxLQUFJLENBQUNiLE1BQUwsQ0FBWWlCLE9BQVosQ0FBb0JDLEtBQXBCLENBQTBCQyxNQUExQixDQUFpQ0wsR0FBakMsRUFBc0NFLEdBQUcsR0FBR0YsR0FBTixHQUFZLENBQWxEO0FBQ0g7O0FBRURqQyxJQUFBQSxNQUFNLENBQUN1QyxJQUFQLENBQVl4QyxPQUFPLENBQUN5QyxLQUFwQixFQUEyQnRDLE9BQTNCLENBQW1DLFVBQUF1QyxJQUFJLEVBQUk7QUFDdkMsVUFBSSw2QkFBSSxLQUFJLENBQUNwQixXQUFULElBQXNCLEtBQUksQ0FBQ0QsTUFBM0IsR0FBbUNzQixJQUFuQyxDQUF3QyxVQUFBNUMsQ0FBQztBQUFBLGVBQUkyQyxJQUFJLENBQUNFLFFBQUwsQ0FBYzdDLENBQWQsQ0FBSjtBQUFBLE9BQXpDLENBQUosRUFBb0U7QUFDaEU7QUFDQSxlQUFPQyxPQUFPLENBQUN5QyxLQUFSLENBQWNDLElBQWQsQ0FBUDtBQUNIO0FBQ0osS0FMRDtBQU1ILEdBOUNnRjs7QUFBQSxzQ0FnRHBFLFlBQU07QUFDZixRQUFNRyxFQUFFLEdBQUcsS0FBSSxDQUFDeEIsTUFBaEI7QUFFQSxRQUFNeUIsR0FBRyxHQUFHLEtBQUksQ0FBQzFCLE1BQWpCLENBSGUsQ0FLZjs7QUFDQzJCLElBQUFBLE1BQUQsQ0FBZ0I1QixFQUFoQixHQUFxQjFCLFdBQVcsQ0FBQ3VELGlCQUFLQyxJQUFMLENBQVVKLEVBQUUsR0FBRyxRQUFmLENBQUQsQ0FBaEM7O0FBRUEsSUFBQSxLQUFJLENBQUNLLFVBQUw7O0FBRUE1QyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxZQUFaOztBQUVBNEMsMkJBQU9DLFNBQVAsQ0FBaUI7QUFDYkMsTUFBQUEsS0FBSyxFQUFFLGlCQUFXLENBQ2Q7QUFDSCxPQUhZO0FBSWJDLE1BQUFBLE9BQU8sRUFBRSxtQkFBVyxDQUNoQjtBQUNILE9BTlk7QUFPYkMsTUFBQUEsSUFBSSxFQUFFLGdCQUFXLENBQ2I7QUFDSCxPQVRZO0FBVWJDLE1BQUFBLElBQUksRUFBRSxnQkFBVyxDQUNiO0FBQ0gsT0FaWTtBQWFiQyxNQUFBQSxLQUFLLEVBQUUsaUJBQVcsQ0FDZDtBQUNIO0FBZlksS0FBakI7O0FBa0JBLFFBQUlDLENBQUMsR0FBR1AsdUJBQU9RLEtBQVAsQ0FBYTtBQUNqQkMsTUFBQUEsR0FBRyxFQUFFLEtBQUksQ0FBQ3RDLFdBRE87QUFFakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFJLENBQUNzQyxhQUZHO0FBR2pCUixNQUFBQSxLQUFLLEVBQUUsS0FIVTtBQUlqQlMsTUFBQUEsTUFBTSxFQUFFLEtBSlM7QUFLakJSLE1BQUFBLE9BQU8sRUFBRSxLQUxRO0FBTWpCUyxNQUFBQSxRQUFRLEVBQUUsS0FOTztBQU9qQkosTUFBQUEsS0FBSyxFQUFFLEtBUFU7QUFRakJLLE1BQUFBLFFBQVEsRUFBRSxJQVJPO0FBU2pCQyxNQUFBQSxRQUFRLEVBQUUsSUFUTztBQVVqQkMsTUFBQUEsTUFBTSxFQUFFLElBVlM7QUFXakJDLE1BQUFBLFVBQVUsRUFBRSxLQVhLO0FBWWpCQyxNQUFBQSxRQUFRLEVBQUU7QUFaTyxLQUFiLENBQVI7O0FBZUEsUUFBSUMsQ0FBQyxHQUFHQyxJQUFJLENBQUNYLEtBQUwsQ0FBV0QsQ0FBQyxDQUFDYSxJQUFiLEVBQ0gvRCxNQURHLENBQ0ksVUFBQ1QsQ0FBRDtBQUFBLGFBQVlBLENBQUMsQ0FBQ3lFLEdBQWQ7QUFBQSxLQURKLEVBRUgzRSxNQUZHLENBRUksVUFBQ0MsQ0FBRCxFQUFTQyxDQUFULEVBQW9CO0FBQ3hCTyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWStELElBQUksQ0FBQ0csU0FBTCxDQUFlLHlCQUFhMUUsQ0FBQyxDQUFDMkUsT0FBRixDQUFVQyxNQUFWLENBQWlCLGFBQWpCLENBQWIsQ0FBZixDQUFaO0FBQ0EsK0JBQ083RSxDQURQLGdDQUVRQyxDQUFDLENBQUM2RSxJQUZWLGNBRWtCN0UsQ0FBQyxDQUFDeUUsR0FGcEIsR0FFNEIseUJBQWF6RSxDQUFDLENBQUMyRSxPQUFGLENBQVVDLE1BQVYsQ0FBaUIsYUFBakIsQ0FBYixDQUY1QjtBQUlILEtBUkcsRUFRRCxFQVJDLENBQVI7QUFTQXJFLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZOEQsQ0FBWjtBQUVBdkIsSUFBQUEsR0FBRyxDQUFDK0IsR0FBSixDQUFRdEYsS0FBUjtBQUVBLFFBQU11RixRQUFhLEdBQUc3RSxNQUFNLENBQUNDLE9BQVAsbUJBQW9CVCxXQUFXLENBQUN1RCxpQkFBS0MsSUFBTCxDQUFVSixFQUFFLEdBQUcsV0FBZixDQUFELENBQS9CLE1BQWlFd0IsQ0FBakUsRUFBdEIsQ0ExRGUsQ0EyRGY7O0FBQ0EsaUNBQUlTLFFBQUosR0FBaUIsRUFBakIsRUFBcUIzRSxPQUFyQixDQUE2QixpQkFBZTtBQUFBO0FBQUEsVUFBYkMsR0FBYTtBQUFBLFVBQVJDLEVBQVE7O0FBQUEsdUJBQ2pCLHFCQUFTRCxHQUFULENBRGlCO0FBQUE7QUFBQSxVQUNqQ08sSUFEaUM7QUFBQSxVQUMzQkMsTUFEMkIsa0JBR3hDOzs7QUFDQSxVQUFJRCxJQUFJLElBQUlDLE1BQVIsSUFBa0IsTUFBTW1FLElBQU4sQ0FBV3BFLElBQVgsQ0FBdEIsRUFBd0M7QUFDcEMsMEJBQU0sQ0FBQ21DLEdBQUcsQ0FBQ2xDLE1BQUQsQ0FBVixzQkFBaUNSLEdBQWpDO0FBQ0EsMEJBQ0ksRUFBRSxPQUFPQyxFQUFQLEtBQWMsVUFBZCxJQUE0QixRQUFPQSxFQUFQLE1BQWMsUUFBMUMsSUFBc0QsT0FBT0EsRUFBUCxLQUFjLFFBQXRFLENBREosMEJBRXFCLGlCQUFLRCxHQUFMLENBRnJCLDhEQUVrRiwwQkFBYUMsRUFBYixFQUZsRjs7QUFLQSxZQUFJLE9BQU9BLEVBQVAsS0FBYyxRQUFsQixFQUE0QjtBQUN4QnlDLFVBQUFBLEdBQUcsQ0FBQytCLEdBQUosQ0FDSSxTQUFTRSxJQUFULENBQWNwRSxJQUFkLElBQXNCLElBQUlxRSxNQUFKLFlBQWVyRSxJQUFmLE9BQXRCLEdBQWdEQSxJQURwRCxFQUVJLHFDQUNJLFVBQUNzRSxRQUFELEVBQVdDLEdBQVg7QUFBQSxtQkFBeUJ0RSxNQUFNLEdBQUdzRSxHQUFHLENBQUN0RSxNQUFKLENBQVd1RSxXQUFYLE9BQTZCdkUsTUFBTSxDQUFDdUUsV0FBUCxFQUFoQyxHQUF1RCxJQUF0RjtBQUFBLFdBREosRUFFSTtBQUNJOUQsWUFBQUEsTUFBTSxFQUFFLG9CQUFRaEIsRUFBUjtBQURaLFdBRkosQ0FGSjtBQVNILFNBVkQsTUFVTztBQUNILFVBQUEsS0FBSSxDQUFDZSxNQUFMLENBQVlSLE1BQVosRUFBb0JELElBQXBCLEVBQTBCLDhCQUFrQk4sRUFBbEIsQ0FBMUI7QUFDSDtBQUNKO0FBQ0osS0F6QkQ7QUEwQkF5QyxJQUFBQSxHQUFHLENBQUMrQixHQUFKLENBQVF0RixLQUFSO0FBRUEsSUFBQSxLQUFJLENBQUMwQyxRQUFMLEdBQWdCLEtBQUksQ0FBQ2IsTUFBTCxDQUFZaUIsT0FBWixDQUFvQkMsS0FBcEIsQ0FBMEJ6QyxNQUExQixDQUNaLFVBQUNDLENBQUQsVUFBMENzRixLQUExQztBQUFBLFVBQWdCQyxJQUFoQixVQUFnQkEsSUFBaEI7QUFBQSxhQUE2REEsSUFBSSxLQUFLOUYsS0FBSyxDQUFDOEYsSUFBZixnQ0FBMEJ2RixDQUExQixJQUE2QnNGLEtBQTdCLEtBQXNDdEYsQ0FBbkc7QUFBQSxLQURZLEVBRVosRUFGWSxDQUFoQjtBQUlILEdBNUlnRjs7QUFBQSxpQ0E4SXpFLFlBQU07QUFDVixRQUFJO0FBQ0EsTUFBQSxLQUFJLENBQUN3RixhQUFMOztBQUNBLE1BQUEsS0FBSSxDQUFDdEQsVUFBTDtBQUNILEtBSEQsQ0FHRSxPQUFPdUQsQ0FBUCxFQUFVO0FBQ1JqRixNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWdGLENBQVo7QUFDQWpGLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixHQUZRLENBR1I7QUFDQTtBQUNIO0FBQ0osR0F4SmdGOztBQUM3RSxPQUFLYyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxPQUFLRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxPQUFLRSxXQUFMLEdBQW1Ca0UsS0FBSyxDQUFDQyxPQUFOLENBQWNuRSxXQUFkLElBQTZCQSxXQUE3QixHQUEyQyxDQUFDQSxXQUFELENBQTlEO0FBRUEsT0FBS3VDLGFBQUwsR0FBcUJ0QyxPQUFyQjtBQUVBSCxFQUFBQSxNQUFNLENBQUN5RCxHQUFQLENBQVdhLHVCQUFXQyxJQUFYLENBQWdCO0FBQUVDLElBQUFBLEtBQUssRUFBRSxLQUFUO0FBQWdCQyxJQUFBQSxNQUFNLEVBQUU7QUFBeEIsR0FBaEIsQ0FBWDtBQUNBekUsRUFBQUEsTUFBTSxDQUFDeUQsR0FBUCxDQUNJYSx1QkFBV0ksVUFBWCxDQUFzQjtBQUNsQkMsSUFBQUEsUUFBUSxFQUFFLElBRFE7QUFFbEJILElBQUFBLEtBQUssRUFBRTtBQUZXLEdBQXRCLENBREo7QUFPQSxPQUFLSSxLQUFMO0FBQ0gsQzs7ZUEySVU3RSxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNob2tpZGFyLCB7IEZTV2F0Y2hlciB9IGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBodHRwUHJveHlNaWRkbGUgZnJvbSAnaHR0cC1wcm94eS1taWRkbGV3YXJlJztcbmltcG9ydCB7IGRlYWxQYXRoLCBjcmVhdGVNb2NrSGFuZGxlciwgd2luUGF0aCwgd2Fybiwgd2FybmJnLCBlcnJvciwgZXJyb3JiZywganVkZ2UgfSBmcm9tICcuL3V0aWxzL3Rvb2xzJztcbmltcG9ydCBhcGlkb2MgZnJvbSAnYXBpZG9jLWNvcmUnO1xuaW1wb3J0IHsgY3JlYXRlT2JqZWN0IH0gZnJvbSAnLi91dGlscy9wYXJzZSc7XG5cbmNvbnN0IERNVEFHID0gKC4uLmFyZzogYW55W10pID0+IGFyZ1syXSgpO1xuXG5jb25zdCByZXF1aXJlRmlsZSA9IChmaWxlczogc3RyaW5nW10pID0+IHtcbiAgICBsZXQgY291bnQ6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZmlsZXMucmVkdWNlKChyLCB2KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlcXVpcmUodik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZXN1bHQpLmZvckVhY2goKFtrZXksIGZuXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvdW50W2tleV0gPSBbLi4uKGNvdW50W2tleV0gfHwgW10pLCB2XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnIsXG4gICAgICAgICAgICAgICAgLi4uKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIHJlc3VsdCksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7ZXJyb3JiZyhgICR7dn0gYCl9IOaWh+S7tuagvOW8j+S4jeespuWQiOimgeaxgu+8jOW3sui/h+a7pO+8gWApO1xuXG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgIH0sIHt9KTtcblxuICAgIE9iamVjdC5lbnRyaWVzKGNvdW50KVxuICAgICAgICAuZmlsdGVyKChbaywgdl06IGFueSkgPT4gdi5sZW5ndGggPiAxKVxuICAgICAgICAuZm9yRWFjaCgoW2ssIHZdOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBbcGF0aCwgbWV0aG9kXSA9IGRlYWxQYXRoKGspO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgY2hhbGsuYmdZZWxsb3coY2hhbGsud2hpdGUoYCR7bWV0aG9kfWApKSxcbiAgICAgICAgICAgICAgICBjaGFsay55ZWxsb3cocGF0aCksXG4gICAgICAgICAgICAgICAgJ+WHuueOsOasoeaVsO+8micsXG4gICAgICAgICAgICAgICAgZXJyb3JiZyhjaGFsay5ib2xkKHYubGVuZ3RoKSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdi5mb3JFYWNoKChvOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAke3dhcm5iZyhvKX1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElkbU9wdGlvbnMge1xuICAgIHBhcnNlcnM6IGFueTtcbiAgICB0YXJnZXQ6IHN0cmluZztcbiAgICB3YXRjaFRhcmdldDogc3RyaW5nIHwgc3RyaW5nW107XG59XG5jbGFzcyBETSB7XG4gICAgcHJpdmF0ZSB0YXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHByaXZhdGUgd2F0Y2hUYXJnZXQ6IHN0cmluZ1tdID0gW107XG4gICAgcHJpdmF0ZSBhcGlkb2NQYXJzZXJzOiBhbnkgPSB7fTtcbiAgICBwcml2YXRlIGFwaWRvY1RhcmdldDogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSBpbmRleEFycjogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHNlcnZlcjogYW55O1xuICAgIHByaXZhdGUgd2F0Y2hlcjogRlNXYXRjaGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGFueSwgeyB0YXJnZXQsIHdhdGNoVGFyZ2V0ID0gW10sIHBhcnNlcnMgPSB7fSB9OiBJZG1PcHRpb25zKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy53YXRjaFRhcmdldCA9IEFycmF5LmlzQXJyYXkod2F0Y2hUYXJnZXQpID8gd2F0Y2hUYXJnZXQgOiBbd2F0Y2hUYXJnZXRdO1xuXG4gICAgICAgIHRoaXMuYXBpZG9jUGFyc2VycyA9IHBhcnNlcnM7XG5cbiAgICAgICAgc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzVtYicsIHN0cmljdDogZmFsc2UgfSkpO1xuICAgICAgICBzZXJ2ZXIudXNlKFxuICAgICAgICAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgICAgICAgICBleHRlbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogJzVtYicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlV2F0Y2hlciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy53YXRjaGVyID0gY2hva2lkYXIud2F0Y2goW3RoaXMudGFyZ2V0LCAuLi50aGlzLndhdGNoVGFyZ2V0XSwge1xuICAgICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICAgICAgICAgIGlnbm9yZWQ6IC8oXnxbXFwvXFxcXF0pXFwuLiooPzwhXFwuanMpJC8sIC8v5b+955Wl54K55paH5Lu2XG4gICAgICAgICAgICBjd2Q6ICcuJywgLy/ooajnpLrlvZPliY3nm67lvZVcbiAgICAgICAgICAgIGRlcHRoOiA5OSwgLy/liLDkvY3kuoYuLi4uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndhdGNoZXIub24oJ2NoYW5nZScsIHBhdGggPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cod2FybmJnKCdETScpLCB3YXJuKCdDSEFOR0VEJyksIHBhdGgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kU2VydmVyKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDmuIXpmaTnvJPlrZhcbiAgICBjbGVhckNhY2hlID0gKCkgPT4ge1xuICAgICAgICAvLyDliKDpmaTml6fnmoRtb2NrXG4gICAgICAgIGlmICh0aGlzLmluZGV4QXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50aGlzLmluZGV4QXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLl9yb3V0ZXIuc3RhY2suc3BsaWNlKG1pbiwgbWF4IC0gbWluICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyhyZXF1aXJlLmNhY2hlKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKFsuLi50aGlzLndhdGNoVGFyZ2V0LCB0aGlzLnRhcmdldF0uc29tZSh2ID0+IGZpbGUuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyb3IoJ0RlbGV0ZSBDYWNoZScpLCBmaWxlKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVxdWlyZS5jYWNoZVtmaWxlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGJpbmRTZXJ2ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRiID0gdGhpcy50YXJnZXQ7XG5cbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5zZXJ2ZXI7XG5cbiAgICAgICAgLy8g5rOo5YWlc3RvcmVcbiAgICAgICAgKGdsb2JhbCBhcyBhbnkpLkRNID0gcmVxdWlyZUZpbGUoZ2xvYi5zeW5jKGRiICsgJy8uKi5qcycpKTtcblxuICAgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnPT09PT09PT09PScpO1xuXG4gICAgICAgIGFwaWRvYy5zZXRMb2dnZXIoe1xuICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVyYm9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYSA9IGFwaWRvYy5wYXJzZSh7XG4gICAgICAgICAgICBzcmM6IHRoaXMud2F0Y2hUYXJnZXQsXG4gICAgICAgICAgICBwYXJzZXJzOiB0aGlzLmFwaWRvY1BhcnNlcnMsXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdmVyYm9zZTogZmFsc2UsXG4gICAgICAgICAgICBzaW11bGF0ZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgICAgICBjb2xvcml6ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1hcmtkb3duOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlnOiAnLi8nLFxuICAgICAgICAgICAgYXBpcHJpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYiA9IEpTT04ucGFyc2UoYS5kYXRhKVxuICAgICAgICAgICAgLmZpbHRlcigodjogYW55KSA9PiB2LnVybClcbiAgICAgICAgICAgIC5yZWR1Y2UoKHI6IGFueSwgdjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoY3JlYXRlT2JqZWN0KHYuc3VjY2Vzcy5maWVsZHNbJ1N1Y2Nlc3MgMjAwJ10pKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAgICAgW2Ake3YudHlwZX0gJHt2LnVybH1gXTogY3JlYXRlT2JqZWN0KHYuc3VjY2Vzcy5maWVsZHNbJ1N1Y2Nlc3MgMjAwJ10pLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGIpO1xuXG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIGNvbnN0IG1vY2tEYXRhOiBhbnkgPSBPYmplY3QuZW50cmllcyh7IC4uLnJlcXVpcmVGaWxlKGdsb2Iuc3luYyhkYiArICcvISguKSouanMnKSksIC4uLmIgfSk7XG4gICAgICAgIC8vIOa3u+WKoOi3r+eUsVxuICAgICAgICBbLi4ubW9ja0RhdGEsIC4uLltdXS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtwYXRoLCBtZXRob2RdID0gZGVhbFBhdGgoa2V5KTtcblxuICAgICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgICAgICBpZiAocGF0aCAmJiBtZXRob2QgJiYgL15cXC8vLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICBqdWRnZSghYXBwW21ldGhvZF0sIGBtZXRob2Qgb2YgJHtrZXl9IGlzIG5vdCB2YWxpZGApO1xuICAgICAgICAgICAgICAgIGp1ZGdlKFxuICAgICAgICAgICAgICAgICAgICAhKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBgbW9jayB2YWx1ZSBvZiAke3dhcm4oa2V5KX0gc2hvdWxkIGJlIGZ1bmN0aW9uIG9yIG9iamVjdCBvciBzdHJpbmcsIGJ1dCBnb3QgJHtlcnJvcih0eXBlb2YgZm4pfWAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51c2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwoLitcXCkvLnRlc3QocGF0aCkgPyBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKSA6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUHJveHlNaWRkbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhdGhuYW1lLCByZXE6IGFueSkgPT4gKG1ldGhvZCA/IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gbWV0aG9kLnRvTG93ZXJDYXNlKCkgOiB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogd2luUGF0aChmbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJbbWV0aG9kXShwYXRoLCBjcmVhdGVNb2NrSGFuZGxlcihmbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC51c2UoRE1UQUcpO1xuXG4gICAgICAgIHRoaXMuaW5kZXhBcnIgPSB0aGlzLnNlcnZlci5fcm91dGVyLnN0YWNrLnJlZHVjZShcbiAgICAgICAgICAgIChyOiBudW1iZXJbXSwgeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0sIGluZGV4OiBudW1iZXIpID0+IChuYW1lID09PSBETVRBRy5uYW1lID8gWy4uLnIsIGluZGV4XSA6IHIpLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERNO1xuIl19