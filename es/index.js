import url from 'url';
import assert from 'assert';

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
    watcher.on('change', function (path) {
        console.log(chalk$1.bgCyan(chalk$1.white(' DM ')), chalk$1.cyan('CHANGED'), store.path);
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

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var glob = require('glob');
var bodyParser = require('body-parser');

var debug = require('debug')('DM');

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
    return files.reduce(function (r, v) {
        return _extends({}, r, require(v));
    }, {});
};

var realApplyMock = function realApplyMock(app) {
    var db = store.path;

    // 清除缓存
    Object.keys(require.cache).forEach(function (file) {
        if (file.includes(db)) {
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
    var config = requireFile(glob.sync(db + '/!(.)*.js'));
    Object.keys(config).forEach(function (key) {
        var _dealPath = dealPath(key),
            _dealPath2 = slicedToArray(_dealPath, 2),
            path = _dealPath2[0],
            method = _dealPath2[1];

        assert(!!app[method], 'method of ' + key + ' is not valid');
        assert(typeof config[key] === 'function' || _typeof(config[key]) === 'object' || typeof config[key] === 'string', 'mock value of ' + key + ' should be function or object or string, but got ' + _typeof(config[key]));
        if (typeof config[key] === 'string') {
            if (/\(.+\)/.test(path)) {
                path = new RegExp('^' + path + '$');
            }
            app.use(path, createProxy(method, path, config[key]));
        } else {
            app[method](path, createMockHandler(method, path, config[key]));
        }
    });
    app.use(dmEnd);

    var indexArr = app._router.stack.reduce(function (r, _ref, index) {
        var name = _ref.name;
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

var applyMock = function applyMock(_ref2) {
    var server = _ref2.server,
        _ref2$path = _ref2.path,
        cpath = _ref2$path === undefined ? store.path : _ref2$path;

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

var server = require('../server');

export default server;
export { applyMock };
