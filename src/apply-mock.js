import fs from 'fs';
import assert from 'assert';
import path from 'path';

const bodyParser = require('body-parser');

import store from './store';
import { dealPath, createMockHandler, createProxy, outputError } from './utils';
import createWatcher from './watcher';

const debug = require('debug')('DM');

export const realApplyMock = devServer => {
    const db = store.path;

    // 清除缓存
    Object.keys(require.cache).forEach(file => {
        if (file.includes(db)) {
            debug(`delete cache ${file}`);
            delete require.cache[file];
        }
    });
    const files = fs.readdirSync(db);
    const { app } = devServer;

    devServer.use(bodyParser.json({ limit: '5mb', strict: false }));
    devServer.use(
        bodyParser.urlencoded({
            extended: true,
            limit: '5mb'
        })
    );

    const config = files.reduce(
        (r, v) => ({
            ...r,
            ...require(path.resolve(db, v))
        }),
        {}
    );

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

    // 调整 stack，把 historyApiFallback 放到最后
    let lastIndex = null;
    app._router.stack.forEach((item, index) => {
        if (item.name === 'webpackDevMiddleware') {
            lastIndex = index;
        }
    });
    const mockAPILength = app._router.stack.length - 1 - lastIndex;
    if (lastIndex && lastIndex > 0) {
        const newStack = app._router.stack;
        newStack.push(newStack[lastIndex - 1]);
        newStack.push(newStack[lastIndex]);
        newStack.splice(lastIndex - 1, 2);
        app._router.stack = newStack;
    }

    createWatcher({
        server: devServer,
        applyBefore: () => {
            // 删除旧的 mock api
            app._router.stack.splice(lastIndex - 1, mockAPILength);
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
