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

export const realApplyMock = app => {
    const db = store.path;

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
    const config = requireFile(glob.sync(db + '/!(.)*.js'));
    Object.keys(config).forEach(key => {
        let [path, method] = dealPath(key);
        assert(!!app[method], `method of ${key} is not valid`);
        assert(
            typeof config[key] === 'function' || typeof config[key] === 'object' || typeof config[key] === 'string',
            `mock value of ${key} should be function or object or string, but got ${typeof config[key]}`
        );
        if (typeof config[key] === 'string') {
            if (/\(.+\)/.test(path)) {
                path = new RegExp(`^${path}$`);
            }
            app.use(path, createProxy(method, path, config[key]));
        } else {
            app[method](path, createMockHandler(method, path, config[key]));
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

export const applyMock = ({ server, path: cpath = store.path }) => {
    store.path = cpath;
    try {
        realApplyMock(server);
    } catch (e) {
        console.log(e);
        console.log();
        outputError(e);
        createWatcher({ server });
    }
};
