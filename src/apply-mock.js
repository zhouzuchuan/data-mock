const assert = require('assert');
const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const which = require('which');
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');

import store from './store';
import { dealPath, createMockHandler, createProxy, outputError } from './utils';
import createWatcher from './watcher';

import { createMock } from './createMock';

const debug = require('debug')('DM');

const dmStart = (...arg) => arg[2]();
const dmEnd = (...arg) => arg[2]();

const requireFile = files => {
    let count = {};

    const result = files.reduce((r, v) => {
        const result = require(v);

        if (typeof result === 'object') {
            Object.entries(result).forEach(([key, fn]) => {
                count[key] = [...(count[key] || []), v];
            });

            return {
                ...r,
                ...(typeof result === 'object' && result),
            };
        } else {
            console.log(`${chalk.bgRed(chalk.white(` ${v} `))} 文件格式不符合要求，已过滤！`);

            return r;
        }
    }, {});

    Object.entries(count)
        .filter(([k, v]) => v.length > 1)
        .forEach(([k, v]) => {
            let [path, method] = dealPath(k);
            console.log('');
            console.log(
                chalk.bgYellow(chalk.white(`${method}`)),
                chalk.yellow(path),
                '出现次数：',
                chalk.bgRed(chalk.white(chalk.bold(` ${v.length} `))),
            );
            v.forEach(o => {
                console.log(`  ${chalk.bgCyan(chalk.white(` ${o} `))}`);
            });
            console.log('');
        });

    return result;
};

export const bindMockServer = app => {
    const db = store.target;

    // 清除缓存
    Object.keys(require.cache).forEach(file => {
        if ([...store.watchTarget, db].some(v => file.includes(v))) {
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
            limit: '5mb',
        }),
    );
    app.use(dmStart);
    // 添加路由
    Object.entries(requireFile(glob.sync(db + '/!(.)*.js'))).forEach(([key, fn]) => {
        let [path, method] = dealPath(key);

        // 非本地路径过滤
        if (path && method && /^\//.test(path)) {
            assert(!!app[method], `method of ${key} is not valid`);
            assert(
                typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string',
                `mock value of ${key} should be function or object or string, but got ${typeof fn}`,
            );
            if (typeof fn === 'string') {
                if (/\(.+\)/.test(path)) {
                    path = new RegExp(`^${path}$`);
                }
                app.use(path, createProxy(method, path, fn));
            } else {
                app[method](path, createMockHandler(method, path, fn));
            }
        }
    });

    app.use(dmEnd);

    const indexArr = app._router.stack.reduce(
        (r, { name }, index) => (['dmStart', 'dmEnd'].includes(name) ? [...r, index] : r),
        [],
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
        },
    });
};

export const bindServer = ({ server, target = store.target, watchTarget = store.watchTarget }) => {
    store.target = target;
    store.watchTarget = Array.isArray(watchTarget) ? watchTarget : [watchTarget];

    try {
        bindMockServer(server);
    } catch (e) {
        console.log(e);
        console.log();
        outputError(e);
        createWatcher({ server });
    }
};
