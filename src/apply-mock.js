import assert from 'assert';
const glob = require('glob');
const bodyParser = require('body-parser');

import store from './store';
import { dealPath, createMockHandler, createProxy, outputError } from './utils';
import createWatcher from './watcher';

const debug = require('debug')('DM');

const dmStart = (...arg) => arg[2]();
const dmEnd = (...arg) => arg[2]();

const requireFile = files =>
    files.reduce(
        (r, v) => ({
            ...r,
            ...require(v)
        }),
        {}
    );

export const bindMockServer = app => {
    const db = store.target;

    // 清除缓存
    Object.keys(require.cache).forEach(file => {
        if (file.includes(db)) {
            debug(`delete cache ${file}`);
            delete require.cache[file];
        }
    });

    // 注入store
    global.DM = requireFile(glob.sync(db + '/.*.js'));

    app.use(bodyParser.json({ limit: '5mb', strict: false }));
    app.use(
        bodyParser.urlencoded({
            extended: true,
            limit: '5mb'
        })
    );
    app.use(dmStart);
    // 添加路由
    Object.entries(requireFile(glob.sync(db + '/!(.)*.js'))).forEach(([key, fn]) => {
        let [path, method] = dealPath(key);

        if (!path || !method || !/^\//.test(path)) return;

        assert(!!app[method], `method of ${key} is not valid`);
        assert(
            typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string',
            `mock value of ${key} should be function or object or string, but got ${typeof fn}`
        );
        if (typeof fn === 'string') {
            if (/\(.+\)/.test(path)) {
                path = new RegExp(`^${path}$`);
            }
            app.use(path, createProxy(method, path, fn));
        } else {
            app[method](path, createMockHandler(method, path, fn));
        }
    });

    app.use(dmEnd);

    const indexArr = app._router.stack.reduce(
        (r, { name }, index) => (['dmStart', 'dmEnd'].includes(name) ? [...r, index] : r),
        []
    );

    createWatcher({
        server: app,
        applyBefore: () => {
            // 删除旧的mock
            if (indexArr.length) {
                const min = Math.min(...indexArr);
                const max = Math.max(...indexArr);
                app._router.stack.splice(min, max - min + 1);
            }
        }
    });
};

export const bindServer = ({ server, target = store.target }) => {
    store.target = target;
    try {
        bindMockServer(server);
    } catch (e) {
        console.log(e);
        console.log();
        outputError(e);
        createWatcher({ server });
    }
};
