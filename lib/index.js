"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chokidar = _interopRequireDefault(require("chokidar"));

var _chalk = _interopRequireDefault(require("chalk"));

var _glob = _interopRequireDefault(require("glob"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _utils = require("./utils");

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

var debug = require('debug')('DM');

var dmStart = function dmStart() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  return arg[2]();
};

var dmEnd = function dmEnd() {
  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  return arg[2]();
};

var requireFile = function requireFile(files) {
  var count = {};
  console.log(files);
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
      console.log("".concat(_chalk["default"].bgRed(_chalk["default"].white(" ".concat(v, " "))), " \u6587\u4EF6\u683C\u5F0F\u4E0D\u7B26\u5408\u8981\u6C42\uFF0C\u5DF2\u8FC7\u6EE4\uFF01"));
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

    var _dealPath = (0, _utils.dealPath)(k),
        _dealPath2 = _slicedToArray(_dealPath, 2),
        path = _dealPath2[0],
        method = _dealPath2[1];

    console.log('');
    console.log(_chalk["default"].bgYellow(_chalk["default"].white("".concat(method))), _chalk["default"].yellow(path), '出现次数：', _chalk["default"].bgRed(_chalk["default"].white(_chalk["default"].bold(" ".concat(v.length, " ")))));
    v.forEach(function (o) {
      console.log("  ".concat(_chalk["default"].bgCyan(_chalk["default"].white(" ".concat(o, " ")))));
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
      console.log(_chalk["default"].bgCyan(_chalk["default"].white(' DM ')), _chalk["default"].cyan('CHANGED'), path); // watcher.close();

      console.log(_this.indexArr); // 删除旧的mock

      if (_this.indexArr.length) {
        var min = Math.min.apply(Math, _toConsumableArray(_this.indexArr));
        var max = Math.max.apply(Math, _toConsumableArray(_this.indexArr));

        _this.server._router.stack.splice(min, max - min + 1);
      }

      _this.bindServer();
    });
  });

  _defineProperty(this, "bindServer", function () {
    var db = _this.target;
    var app = _this.server; // 清除缓存

    Object.keys(require.cache).forEach(function (file) {
      if ([].concat(_toConsumableArray(_this.watchTarget), [db]).some(function (v) {
        return file.includes(v);
      })) {
        debug("delete cache ".concat(file));
        delete require.cache[file];
      }
    }); // 注入store
    // global.DM = requireFile(globby.sync(db + '/.*.js'));

    console.log('sssss');
    app.use(dmStart); // 添加路由

    Object.entries(requireFile(_glob["default"].sync(db + '/!(.)*.js'))).forEach(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          key = _ref9[0],
          fn = _ref9[1];

      var _dealPath3 = (0, _utils.dealPath)(key),
          _dealPath4 = _slicedToArray(_dealPath3, 2),
          path = _dealPath4[0],
          method = _dealPath4[1]; // 非本地路径过滤


      if (path && method && /^\//.test(path)) {
        // assert(!!app[method], `method of ${key} is not valid`);
        // assert(
        //     typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string',
        //     `mock value of ${key} should be function or object or string, but got ${typeof fn}`,
        // );
        console.log(path, method, fn); // if (typeof fn === 'string') {
        //     if (/\(.+\)/.test(path)) {
        //         path = new RegExp(`^${path}$`);
        //     }
        //     // app.use(path, createProxy(method, path, fn));
        // } else {

        _this.server[method](path, (0, _utils.createMockHandler)(method, path, fn)); // }

      }
    });
    app.use(dmEnd);
    console.log('111111111111', _glob["default"].sync(db + '/!(.)*.js'));
    _this.indexArr = _this.server._router.stack.reduce(function (r, _ref10, index) {
      var name = _ref10.name;
      return ['dmStart', 'dmEnd'].includes(name) ? [].concat(_toConsumableArray(r), [index]) : r;
    }, []); // globby(db + '/!(.)*.js').then(files => {
    //     this.server.use(dmStart);
    //     // 添加路由
    //     Object.entries(requireFile(files)).forEach(([key, fn]) => {
    //         let [path, method] = dealPath(key);
    //         // 非本地路径过滤
    //         if (path && method && /^\//.test(path)) {
    //             // assert(!!app[method], `method of ${key} is not valid`);
    //             // assert(
    //             //     typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string',
    //             //     `mock value of ${key} should be function or object or string, but got ${typeof fn}`,
    //             // );
    //             console.log(path, method, fn);
    //             // if (typeof fn === 'string') {
    //             //     if (/\(.+\)/.test(path)) {
    //             //         path = new RegExp(`^${path}$`);
    //             //     }
    //             //     // app.use(path, createProxy(method, path, fn));
    //             // } else {
    //             this.server[method](path, createMockHandler(method, path, fn));
    //             // }
    //         }
    //     });
    //     this.server.use(dmEnd);
    // });
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
  this.start();
  server.use(_bodyParser["default"].json({
    limit: '5mb',
    strict: false
  }));
  server.use(_bodyParser["default"].urlencoded({
    extended: true,
    limit: '5mb'
  }));
};

var _default = DM;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsInJlcXVpcmUiLCJkbVN0YXJ0IiwiYXJnIiwiZG1FbmQiLCJyZXF1aXJlRmlsZSIsImZpbGVzIiwiY291bnQiLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwicmVkdWNlIiwiciIsInYiLCJPYmplY3QiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImtleSIsImZuIiwiY2hhbGsiLCJiZ1JlZCIsIndoaXRlIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsInBhdGgiLCJtZXRob2QiLCJiZ1llbGxvdyIsInllbGxvdyIsImJvbGQiLCJvIiwiYmdDeWFuIiwiRE0iLCJzZXJ2ZXIiLCJ0YXJnZXQiLCJ3YXRjaFRhcmdldCIsIndhdGNoZXIiLCJjaG9raWRhciIsIndhdGNoIiwicGVyc2lzdGVudCIsImlnbm9yZWQiLCJjd2QiLCJkZXB0aCIsIm9uIiwiY3lhbiIsImluZGV4QXJyIiwibWluIiwiTWF0aCIsIm1heCIsIl9yb3V0ZXIiLCJzdGFjayIsInNwbGljZSIsImJpbmRTZXJ2ZXIiLCJkYiIsImFwcCIsImtleXMiLCJjYWNoZSIsImZpbGUiLCJzb21lIiwiaW5jbHVkZXMiLCJ1c2UiLCJnbG9iIiwic3luYyIsInRlc3QiLCJpbmRleCIsIm5hbWUiLCJjcmVhdGVXYXRjaGVyIiwiZSIsIkFycmF5IiwiaXNBcnJheSIsInN0YXJ0IiwiYm9keVBhcnNlciIsImpzb24iLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxPQUFELENBQVAsQ0FBaUIsSUFBakIsQ0FBZDs7QUFFQSxJQUFNQyxPQUFPLEdBQUcsU0FBVkEsT0FBVTtBQUFBLG9DQUFJQyxHQUFKO0FBQUlBLElBQUFBLEdBQUo7QUFB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O0FBQ0EzRCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsR0FGUSxDQUdSO0FBQ0E7QUFDSDtBQUNKLEdBbkk0Qzs7QUFDekMsT0FBS3lCLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtFLFdBQUwsR0FBbUJpQyxLQUFLLENBQUNDLE9BQU4sQ0FBY2xDLFdBQWQsSUFBNkJBLFdBQTdCLEdBQTJDLENBQUNBLFdBQUQsQ0FBOUQ7QUFFQSxPQUFLbUMsS0FBTDtBQUVBckMsRUFBQUEsTUFBTSxDQUFDMkIsR0FBUCxDQUFXVyx1QkFBV0MsSUFBWCxDQUFnQjtBQUFFQyxJQUFBQSxLQUFLLEVBQUUsS0FBVDtBQUFnQkMsSUFBQUEsTUFBTSxFQUFFO0FBQXhCLEdBQWhCLENBQVg7QUFDQXpDLEVBQUFBLE1BQU0sQ0FBQzJCLEdBQVAsQ0FDSVcsdUJBQVdJLFVBQVgsQ0FBc0I7QUFDbEJDLElBQUFBLFFBQVEsRUFBRSxJQURRO0FBRWxCSCxJQUFBQSxLQUFLLEVBQUU7QUFGVyxHQUF0QixDQURKO0FBTUgsQzs7ZUF3SFV6QyxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgZ2xvYmJ5IGZyb20gJ2dsb2JieSc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCB7IGRlYWxQYXRoLCBjcmVhdGVNb2NrSGFuZGxlciwgY3JlYXRlUHJveHksIG91dHB1dEVycm9yIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnRE0nKTtcblxuY29uc3QgZG1TdGFydCA9ICguLi5hcmcpID0+IGFyZ1syXSgpO1xuY29uc3QgZG1FbmQgPSAoLi4uYXJnKSA9PiBhcmdbMl0oKTtcblxuY29uc3QgcmVxdWlyZUZpbGUgPSBmaWxlcyA9PiB7XG4gICAgbGV0IGNvdW50ID0ge307XG5cbiAgICBjb25zb2xlLmxvZyhmaWxlcyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5yZWR1Y2UoKHIsIHYpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVxdWlyZSh2KTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnRba2V5XSA9IFsuLi4oY291bnRba2V5XSB8fCBbXSksIHZdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4ucixcbiAgICAgICAgICAgICAgICAuLi4odHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtjaGFsay5iZ1JlZChjaGFsay53aGl0ZShgICR7dn0gYCkpfSDmlofku7bmoLzlvI/kuI3nrKblkIjopoHmsYLvvIzlt7Lov4fmu6TvvIFgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9LCB7fSk7XG5cbiAgICBPYmplY3QuZW50cmllcyhjb3VudClcbiAgICAgICAgLmZpbHRlcigoW2ssIHZdKSA9PiB2Lmxlbmd0aCA+IDEpXG4gICAgICAgIC5mb3JFYWNoKChbaywgdl0pID0+IHtcbiAgICAgICAgICAgIGxldCBbcGF0aCwgbWV0aG9kXSA9IGRlYWxQYXRoKGspO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgY2hhbGsuYmdZZWxsb3coY2hhbGsud2hpdGUoYCR7bWV0aG9kfWApKSxcbiAgICAgICAgICAgICAgICBjaGFsay55ZWxsb3cocGF0aCksXG4gICAgICAgICAgICAgICAgJ+WHuueOsOasoeaVsO+8micsXG4gICAgICAgICAgICAgICAgY2hhbGsuYmdSZWQoY2hhbGsud2hpdGUoY2hhbGsuYm9sZChgICR7di5sZW5ndGh9IGApKSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdi5mb3JFYWNoKG8gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgICR7Y2hhbGsuYmdDeWFuKGNoYWxrLndoaXRlKGAgJHtvfSBgKSl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuY2xhc3MgRE0ge1xuICAgIHByaXZhdGUgdGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHdhdGNoVGFyZ2V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIHByaXZhdGUgYXBpZG9jVGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIGluZGV4QXJyOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgc2VydmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXIsIHsgdGFyZ2V0LCB3YXRjaFRhcmdldCB9KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLnNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgdGhpcy53YXRjaFRhcmdldCA9IEFycmF5LmlzQXJyYXkod2F0Y2hUYXJnZXQpID8gd2F0Y2hUYXJnZXQgOiBbd2F0Y2hUYXJnZXRdO1xuXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcblxuICAgICAgICBzZXJ2ZXIudXNlKGJvZHlQYXJzZXIuanNvbih7IGxpbWl0OiAnNW1iJywgc3RyaWN0OiBmYWxzZSB9KSk7XG4gICAgICAgIHNlcnZlci51c2UoXG4gICAgICAgICAgICBib2R5UGFyc2VyLnVybGVuY29kZWQoe1xuICAgICAgICAgICAgICAgIGV4dGVuZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxpbWl0OiAnNW1iJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNyZWF0ZVdhdGNoZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChbdGhpcy50YXJnZXQsIC4uLnRoaXMud2F0Y2hUYXJnZXRdLCB7XG4gICAgICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgICAgICAgaWdub3JlZDogLyhefFtcXC9cXFxcXSlcXC4uKig/PCFcXC5qcykkLywgLy/lv73nlaXngrnmlofku7ZcbiAgICAgICAgICAgIGN3ZDogJy4nLCAvL+ihqOekuuW9k+WJjeebruW9lVxuICAgICAgICAgICAgZGVwdGg6IDk5LCAvL+WIsOS9jeS6hi4uLi5cbiAgICAgICAgfSk7XG4gICAgICAgIHdhdGNoZXIub24oJ2NoYW5nZScsIHBhdGggPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuYmdDeWFuKGNoYWxrLndoaXRlKCcgRE0gJykpLCBjaGFsay5jeWFuKCdDSEFOR0VEJyksIHBhdGgpO1xuICAgICAgICAgICAgLy8gd2F0Y2hlci5jbG9zZSgpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmluZGV4QXJyKTtcblxuICAgICAgICAgICAgLy8g5Yig6Zmk5pen55qEbW9ja1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhBcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udGhpcy5pbmRleEFycik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuX3JvdXRlci5zdGFjay5zcGxpY2UobWluLCBtYXggLSBtaW4gKyAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5iaW5kU2VydmVyKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBiaW5kU2VydmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IHRoaXMudGFyZ2V0O1xuXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuc2VydmVyO1xuXG4gICAgICAgIC8vIOa4hemZpOe8k+WtmFxuICAgICAgICBPYmplY3Qua2V5cyhyZXF1aXJlLmNhY2hlKS5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKFsuLi50aGlzLndhdGNoVGFyZ2V0LCBkYl0uc29tZSh2ID0+IGZpbGUuaW5jbHVkZXModikpKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoYGRlbGV0ZSBjYWNoZSAke2ZpbGV9YCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbZmlsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOazqOWFpXN0b3JlXG4gICAgICAgIC8vIGdsb2JhbC5ETSA9IHJlcXVpcmVGaWxlKGdsb2JieS5zeW5jKGRiICsgJy8uKi5qcycpKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnc3Nzc3MnKTtcblxuICAgICAgICBhcHAudXNlKGRtU3RhcnQpO1xuICAgICAgICAvLyDmt7vliqDot6/nlLFcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocmVxdWlyZUZpbGUoZ2xvYi5zeW5jKGRiICsgJy8hKC4pKi5qcycpKSkuZm9yRWFjaCgoW2tleSwgZm5dKSA9PiB7XG4gICAgICAgICAgICBsZXQgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrZXkpO1xuXG4gICAgICAgICAgICAvLyDpnZ7mnKzlnLDot6/lvoTov4fmu6RcbiAgICAgICAgICAgIGlmIChwYXRoICYmIG1ldGhvZCAmJiAvXlxcLy8udGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgIC8vIGFzc2VydCghIWFwcFttZXRob2RdLCBgbWV0aG9kIG9mICR7a2V5fSBpcyBub3QgdmFsaWRgKTtcbiAgICAgICAgICAgICAgICAvLyBhc3NlcnQoXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgZm4gPT09ICdvYmplY3QnIHx8IHR5cGVvZiBmbiA9PT0gJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgLy8gICAgIGBtb2NrIHZhbHVlIG9mICR7a2V5fSBzaG91bGQgYmUgZnVuY3Rpb24gb3Igb2JqZWN0IG9yIHN0cmluZywgYnV0IGdvdCAke3R5cGVvZiBmbn1gLFxuICAgICAgICAgICAgICAgIC8vICk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwYXRoLCBtZXRob2QsIGZuKTtcbiAgICAgICAgICAgICAgICAvLyBpZiAodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoL1xcKC4rXFwpLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBwYXRoID0gbmV3IFJlZ0V4cChgXiR7cGF0aH0kYCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gYXBwLnVzZShwYXRoLCBjcmVhdGVQcm94eShtZXRob2QsIHBhdGgsIGZuKSk7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlclttZXRob2RdKHBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyKG1ldGhvZCwgcGF0aCwgZm4pKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudXNlKGRtRW5kKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnMTExMTExMTExMTExJywgZ2xvYi5zeW5jKGRiICsgJy8hKC4pKi5qcycpKTtcblxuICAgICAgICB0aGlzLmluZGV4QXJyID0gdGhpcy5zZXJ2ZXIuX3JvdXRlci5zdGFjay5yZWR1Y2UoXG4gICAgICAgICAgICAociwgeyBuYW1lIH0sIGluZGV4KSA9PiAoWydkbVN0YXJ0JywgJ2RtRW5kJ10uaW5jbHVkZXMobmFtZSkgPyBbLi4uciwgaW5kZXhdIDogciksXG4gICAgICAgICAgICBbXSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBnbG9iYnkoZGIgKyAnLyEoLikqLmpzJykudGhlbihmaWxlcyA9PiB7XG5cbiAgICAgICAgLy8gICAgIHRoaXMuc2VydmVyLnVzZShkbVN0YXJ0KTtcbiAgICAgICAgLy8gICAgIC8vIOa3u+WKoOi3r+eUsVxuICAgICAgICAvLyAgICAgT2JqZWN0LmVudHJpZXMocmVxdWlyZUZpbGUoZmlsZXMpKS5mb3JFYWNoKChba2V5LCBmbl0pID0+IHtcbiAgICAgICAgLy8gICAgICAgICBsZXQgW3BhdGgsIG1ldGhvZF0gPSBkZWFsUGF0aChrZXkpO1xuXG4gICAgICAgIC8vICAgICAgICAgLy8g6Z2e5pys5Zyw6Lev5b6E6L+H5rukXG4gICAgICAgIC8vICAgICAgICAgaWYgKHBhdGggJiYgbWV0aG9kICYmIC9eXFwvLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIC8vIGFzc2VydCghIWFwcFttZXRob2RdLCBgbWV0aG9kIG9mICR7a2V5fSBpcyBub3QgdmFsaWRgKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gYXNzZXJ0KFxuICAgICAgICAvLyAgICAgICAgICAgICAvLyAgICAgdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBmbiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGZuID09PSAnc3RyaW5nJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIGBtb2NrIHZhbHVlIG9mICR7a2V5fSBzaG91bGQgYmUgZnVuY3Rpb24gb3Igb2JqZWN0IG9yIHN0cmluZywgYnV0IGdvdCAke3R5cGVvZiBmbn1gLFxuICAgICAgICAvLyAgICAgICAgICAgICAvLyApO1xuXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhdGgsIG1ldGhvZCwgZm4pO1xuICAgICAgICAvLyAgICAgICAgICAgICAvLyBpZiAodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyAgICAgICAgICAgICAvLyAgICAgaWYgKC9cXCguK1xcKS8udGVzdChwYXRoKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAvLyAgICAgICAgIHBhdGggPSBuZXcgUmVnRXhwKGBeJHtwYXRofSRgKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIC8vIGFwcC51c2UocGF0aCwgY3JlYXRlUHJveHkobWV0aG9kLCBwYXRoLCBmbikpO1xuICAgICAgICAvLyAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnNlcnZlclttZXRob2RdKHBhdGgsIGNyZWF0ZU1vY2tIYW5kbGVyKG1ldGhvZCwgcGF0aCwgZm4pKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gfVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyAgICAgdGhpcy5zZXJ2ZXIudXNlKGRtRW5kKTtcbiAgICAgICAgLy8gfSk7XG4gICAgfTtcblxuICAgIHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVXYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRTZXJ2ZXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgLy8gb3V0cHV0RXJyb3IoZSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZVdhdGNoZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERNO1xuIl19