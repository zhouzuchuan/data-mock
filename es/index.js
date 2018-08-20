import url from 'url';
import fs from 'fs';
import assert from 'assert';
import path from 'path';

var store = {
    path: ''
};

var proxy = require('express-http-proxy');
var chalk = require('chalk');

/**
 *
 * 修正windon路径问题
 *
 * @param {*} path
 */
var winPath = function winPath(path$$1) {
    return path$$1.replace(/\\/g, '/');
};

var createMockHandler = function createMockHandler(method, path$$1, value) {
    return function () {
        var res = arguments.length <= 1 ? undefined : arguments[1];
        if (typeof value === 'function') {
            value.apply(undefined, arguments);
        } else {
            res.json(value);
        }
    };
};

var createProxy = function createProxy(method, path$$1, target) {
    return proxy(target, {
        filter: function filter(req) {
            return method ? req.method.toLowerCase() === method.toLowerCase() : true;
        },
        forwardPath: function forwardPath(req) {
            var matchPath = req.originalUrl;
            var matches = matchPath.match(path$$1);
            if (matches.length > 1) {
                matchPath = matches[1];
            }
            return winPath(path$$1.join(url.parse(target).path, matchPath));
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
    return key.split(' ').slice(0, 2).reverse();
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

// import chokidar from 'chokidar';

var chokidar = require('chokidar');
var chalk$1 = require('chalk');

var createWatcher = function createWatcher(_ref) {
    var server = _ref.server,
        _ref$applyBefore = _ref.applyBefore,
        applyBefore = _ref$applyBefore === undefined ? function () {} : _ref$applyBefore;

    var watcher = chokidar.watch(store.path, {
        persistent: true,
        ignored: /(^|[\/\\])\../, //忽略点文件
        cwd: '.', //表示当前目录
        depth: 99 //到位了....
    });
    watcher.on('change', function (path$$1) {
        console.log(chalk$1.cyan('[DM]'), chalk$1.green('CHANGED'), store.path);
        watcher.close();
        applyBefore();
        applyMock({ server: server });
    });
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

var bodyParser = require('body-parser');

var debug = require('debug')('DM');

var realApplyMock = function realApplyMock(devServer) {
    var db = store.path;

    // 清除缓存
    Object.keys(require.cache).forEach(function (file) {
        if (file.includes(db)) {
            debug('delete cache ' + file);
            delete require.cache[file];
        }
    });
    var files = fs.readdirSync(db);
    var app = devServer.app;


    devServer.use(bodyParser.json({ limit: '5mb', strict: false }));
    devServer.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));

    var config = files.reduce(function (r, v) {
        return _extends({}, r, require(path.resolve(db, v)));
    }, {});

    Object.keys(config).forEach(function (key) {
        var _dealPath = dealPath(key),
            _dealPath2 = slicedToArray(_dealPath, 2),
            path$$1 = _dealPath2[0],
            method = _dealPath2[1];

        assert(!!app[method], 'method of ' + key + ' is not valid');
        assert(typeof config[key] === 'function' || _typeof(config[key]) === 'object' || typeof config[key] === 'string', 'mock value of ' + key + ' should be function or object or string, but got ' + _typeof(config[key]));
        if (typeof config[key] === 'string') {
            if (/\(.+\)/.test(path$$1)) {
                path$$1 = new RegExp('^' + path$$1 + '$');
            }
            app.use(path$$1, createProxy(method, path$$1, config[key]));
        } else {
            app[method](path$$1, createMockHandler(method, path$$1, config[key]));
        }
    });

    // 调整 stack，把 historyApiFallback 放到最后
    var lastIndex = null;
    app._router.stack.forEach(function (item, index) {
        if (item.name === 'webpackDevMiddleware') {
            lastIndex = index;
        }
    });
    var mockAPILength = app._router.stack.length - 1 - lastIndex;
    if (lastIndex && lastIndex > 0) {
        var newStack = app._router.stack;
        newStack.push(newStack[lastIndex - 1]);
        newStack.push(newStack[lastIndex]);
        newStack.splice(lastIndex - 1, 2);
        app._router.stack = newStack;
    }

    createWatcher({
        server: devServer,
        applyBefore: function applyBefore() {
            // 删除旧的 mock api
            app._router.stack.splice(lastIndex - 1, mockAPILength);
        }
    });
};

var applyMock = function applyMock(_ref) {
    var server = _ref.server,
        _ref$path = _ref.path,
        cpath = _ref$path === undefined ? store.path : _ref$path;

    store.path = cpath;
    try {
        realApplyMock(server);
    } catch (e) {
        console.log(e);
        console.log();
        outputError(e);
        createWatcher({ server: server });
    }
};

var index = {};

export default index;
export { applyMock };
