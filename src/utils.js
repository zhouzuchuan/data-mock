const proxy = require('express-http-proxy');
const chalk = require('chalk');
import url from 'url';

/**
 *
 * 修正windon路径问题
 *
 * @param {*} path
 */
const winPath = path => path.replace(/\\/g, '/');

export const createMockHandler = (method, path, value) => (...args) => {
    const res = args[1];
    if (typeof value === 'function') {
        value(...args);
    } else {
        res.json(value);
    }
};

export const createProxy = (method, path, target) =>
    proxy(target, {
        filter(req) {
            return method ? req.method.toLowerCase() === method.toLowerCase() : true;
        },
        forwardPath(req) {
            let matchPath = req.originalUrl;
            const matches = matchPath.match(path);
            if (matches.length > 1) {
                matchPath = matches[1];
            }
            return winPath(path.join(url.parse(target).path, matchPath));
        }
    });

/**
 *
 * 提取方法以及路径
 *
 * @param {*} key
 */
export const dealPath = key =>
    key
        .split(' ')
        .slice(0, 2)
        .reverse();

export const outputError = error => {
    if (!error) return;

    const filePath = error.message.split(': ')[0];
    const relativeFilePath = filePath;
    const errors = error.stack
        .split('\n')
        .filter(line => line.trim().indexOf('at ') !== 0)
        .map(line => line.replace(`${filePath}: `, ''));
    errors.splice(1, 0, ['']);

    console.log(chalk.red('Failed to parse mock config.'));
    console.log();
    console.log(`Error in ${relativeFilePath}`);
    console.log(errors.join('\n'));
    console.log();
};
