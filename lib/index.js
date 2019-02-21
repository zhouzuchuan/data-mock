'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var url = _interopDefault(require('url'));

var store = {
    target: '',
    watchTarget: []
};

var proxy = require('express-http-proxy');
var chalk = require('chalk');

/**
 *
 * 修正windon路径问题
 *
 * @param {*} path
 */
var winPath = function winPath(path) {
    return path.replace(/\\/g, '/');
};

var createMockHandler = function createMockHandler(method, path, value) {
    return function () {
        var res = arguments.length <= 1 ? undefined : arguments[1];
        if (typeof value === 'function') {
            value.apply(undefined, arguments);
        } else {
            res.json(value);
        }
    };
};

var createProxy = function createProxy(method, path, target) {
    return proxy(target, {
        filter: function filter(req) {
            return method ? req.method.toLowerCase() === method.toLowerCase() : true;
        },
        forwardPath: function forwardPath(req) {
            var matchPath = req.originalUrl;
            var matches = matchPath.match(path);
            if (matches.length > 1) {
                matchPath = matches[1];
            }
            return winPath(path.join(url.parse(target).path, matchPath));
        }
    });
};

/**
 *
 * 提取方法以及路径
 *
 * @param {*} key
 */
var dealPath = function dealPath(key) {
    return key.split(' ').slice(0, 2).reverse().map(function (v) {
        return v.toLowerCase();
    });
};

var outputError = function outputError(error) {
    if (!error) return;

    var filePath = error.message.split(': ')[0];
    var relativeFilePath = filePath;
    var errors = error.stack.split('\n').filter(function (line) {
        return line.trim().indexOf('at ') !== 0;
    }).map(function (line) {
        return line.replace(filePath + ': ', '');
    });
    errors.splice(1, 0, ['']);

    console.log(chalk.red('Failed to parse mock config.'));
    console.log();
    console.log('Error in ' + relativeFilePath);
    console.log(errors.join('\n'));
    console.log();
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// import chokidar from 'chokidar';

var chokidar = require('chokidar');
var chalk$1 = require('chalk');

var createWatcher = function createWatcher(_ref) {
    var server = _ref.server,
        _ref$applyBefore = _ref.applyBefore,
        applyBefore = _ref$applyBefore === undefined ? function (f) {
        return f;
    } : _ref$applyBefore;

    var watcher = chokidar.watch([store.target].concat(toConsumableArray(store.watchTarget)), {
        persistent: true,
        ignored: /(^|[\/\\])\..*(?<!\.js)$/, //忽略点文件
        cwd: '.', //表示当前目录
        depth: 99 //到位了....
    });
    watcher.on('change', function (path) {
        console.log(chalk$1.bgCyan(chalk$1.white(' DM ')), chalk$1.cyan('CHANGED'), path);
        watcher.close();
        applyBefore();
        bindServer({ server: server });
    });
};

var assert = require('assert');
var glob = require('glob');
var path = require('path');
var bodyParser = require('body-parser');
var which = require('which');
var express = require('express');
var chalk$2 = require('chalk');

var debug = require('debug')('DM');

/**
 * 启动命令
 */
function runCmd(cmd, args, fn) {
    args = args || [];
    var runner = require('child_process').spawn(cmd, args, {
        // keep color
        stdio: 'inherit'
    });
    runner.on('close', function (code) {
        if (fn) {
            fn(code);
        }
    });
}

/**
 * 是否安装git
 * */

var findApidoc = function findApidoc() {
    var apidoc = 'apidoc' + (process.platform === 'win32' ? '.cmd' : '');
    try {
        which.sync(apidoc);
        return apidoc;
    } catch (e) {
        log(e);
    }
    throw new Error('please install apidoc');
};

var dmStart = function dmStart() {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
    }

    return arg[2]();
};
var dmEnd = function dmEnd() {
    for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
    }

    return arg[2]();
};

var requireFile = function requireFile(files) {
    var count = {};
    var result = files.reduce(function (r, v) {
        var result = require(v);

        if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
            Object.entries(result).forEach(function (_ref) {
                var _ref2 = slicedToArray(_ref, 2),
                    key = _ref2[0],
                    fn = _ref2[1];

                count[key] = [].concat(toConsumableArray(count[key] || []), [v]);
            });

            return _extends({}, r, (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && result);
        } else {
            console.log(chalk$2.bgRed(chalk$2.white(' ' + v + ' ')) + ' \u6587\u4EF6\u683C\u5F0F\u4E0D\u7B26\u5408\u8981\u6C42\uFF0C\u5DF2\u8FC7\u6EE4\uFF01');

            return r;
        }
    }, {});

    Object.entries(count).filter(function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 2),
            k = _ref4[0],
            v = _ref4[1];

        return v.length > 1;
    }).forEach(function (_ref5) {
        var _ref6 = slicedToArray(_ref5, 2),
            k = _ref6[0],
            v = _ref6[1];

        var _dealPath = dealPath(k),
            _dealPath2 = slicedToArray(_dealPath, 2),
            path = _dealPath2[0],
            method = _dealPath2[1];

        console.log('');
        console.log(chalk$2.bgYellow(chalk$2.white('' + method)), chalk$2.yellow(path), '出现次数：', chalk$2.bgRed(chalk$2.white(chalk$2.bold(' ' + v.length + ' '))));
        v.forEach(function (o) {
            console.log('  ' + chalk$2.bgCyan(chalk$2.white(' ' + o + ' ')));
        });
        console.log('');
    });

    return result;
};

var bindMockServer = function bindMockServer(app) {
    var db = store.target;

    var apidoc = findApidoc();

    var sourceDir = path.join(store.target, '../DATAMOCK-APIDOC');

    app.use('/', express.static(sourceDir));

    runCmd(which.sync(apidoc), ['run', '-i', store.target, '-o', sourceDir], function () {
        console.log('Apidoc create successfully');
        console.log();
    });

    // 清除缓存
    Object.keys(require.cache).forEach(function (file) {
        if ([].concat(toConsumableArray(store.watchTarget), [db]).some(function (v) {
            return file.includes(v);
        })) {
            debug('delete cache ' + file);
            delete require.cache[file];
        }
    });

    // 注入store
    global.DM = requireFile(glob.sync(db + '/.*.js'));

    app.use(bodyParser.json({ limit: '5mb', strict: false }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));
    app.use(dmStart);
    // 添加路由
    Object.entries(requireFile(glob.sync(db + '/!(.)*.js'))).forEach(function (_ref7) {
        var _ref8 = slicedToArray(_ref7, 2),
            key = _ref8[0],
            fn = _ref8[1];

        var _dealPath3 = dealPath(key),
            _dealPath4 = slicedToArray(_dealPath3, 2),
            path = _dealPath4[0],
            method = _dealPath4[1];

        // 非本地路径过滤


        if (path && method && /^\//.test(path)) {
            assert(!!app[method], 'method of ' + key + ' is not valid');
            assert(typeof fn === 'function' || (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object' || typeof fn === 'string', 'mock value of ' + key + ' should be function or object or string, but got ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
            if (typeof fn === 'string') {
                if (/\(.+\)/.test(path)) {
                    path = new RegExp('^' + path + '$');
                }
                app.use(path, createProxy(method, path, fn));
            } else {
                app[method](path, createMockHandler(method, path, fn));
            }
        }
    });

    app.use(dmEnd);

    var indexArr = app._router.stack.reduce(function (r, _ref9, index) {
        var name = _ref9.name;
        return ['dmStart', 'dmEnd'].includes(name) ? [].concat(toConsumableArray(r), [index]) : r;
    }, []);

    createWatcher({
        server: app,
        applyBefore: function applyBefore() {
            // 删除旧的mock
            if (indexArr.length) {
                var min = Math.min.apply(Math, toConsumableArray(indexArr));
                var max = Math.max.apply(Math, toConsumableArray(indexArr));
                app._router.stack.splice(min, max - min + 1);
            }
        }
    });
};

var bindServer = function bindServer(_ref10) {
    var server = _ref10.server,
        _ref10$target = _ref10.target,
        target = _ref10$target === undefined ? store.target : _ref10$target,
        _ref10$watchTarget = _ref10.watchTarget,
        watchTarget = _ref10$watchTarget === undefined ? store.watchTarget : _ref10$watchTarget;

    store.target = target;
    store.watchTarget = Array.isArray(watchTarget) ? watchTarget : [watchTarget];
    try {
        bindMockServer(server);
    } catch (e) {
        console.log(e);
        console.log();
        outputError(e);
        createWatcher({ server: server });
    }
};

var server = require('../server');

exports.default = server;
exports.bindServer = bindServer;
