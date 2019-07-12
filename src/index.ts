import chokidar from 'chokidar';
import chalk from 'chalk';
import globby from 'globby';
import glob from 'glob';
import bodyParser from 'body-parser';
import { dealPath, createMockHandler, createProxy, outputError } from './utils';

const debug = require('debug')('DM');

const dmStart = (...arg) => arg[2]();
const dmEnd = (...arg) => arg[2]();

const requireFile = files => {
    let count = {};

    console.log(files);

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

class DM {
    private target: string = '';
    private watchTarget: string[] = [];
    private apidocTarget: string = '';
    private indexArr: any[] = [];
    private server: any;

    constructor(server, { target, watchTarget }) {
        this.target = target;
        this.server = server;
        this.watchTarget = Array.isArray(watchTarget) ? watchTarget : [watchTarget];

        this.start();

        server.use(bodyParser.json({ limit: '5mb', strict: false }));
        server.use(
            bodyParser.urlencoded({
                extended: true,
                limit: '5mb',
            }),
        );
    }

    createWatcher = () => {
        const watcher = chokidar.watch([this.target, ...this.watchTarget], {
            persistent: true,
            ignored: /(^|[\/\\])\..*(?<!\.js)$/, //忽略点文件
            cwd: '.', //表示当前目录
            depth: 99, //到位了....
        });
        watcher.on('change', path => {
            console.log(chalk.bgCyan(chalk.white(' DM ')), chalk.cyan('CHANGED'), path);
            // watcher.close();

            console.log(this.indexArr);

            // 删除旧的mock
            if (this.indexArr.length) {
                const min = Math.min(...this.indexArr);
                const max = Math.max(...this.indexArr);
                this.server._router.stack.splice(min, max - min + 1);
            }

            this.bindServer();
        });
    };

    bindServer = () => {
        const db = this.target;

        const app = this.server;

        // 清除缓存
        Object.keys(require.cache).forEach(file => {
            if ([...this.watchTarget, db].some(v => file.includes(v))) {
                debug(`delete cache ${file}`);
                delete require.cache[file];
            }
        });

        // 注入store
        // global.DM = requireFile(glob.sync(db + '/.*.js'));

        app.use(dmStart);
        // 添加路由
        Object.entries(requireFile(glob.sync(db + '/!(.)*.js'))).forEach(([key, fn]) => {
            let [path, method] = dealPath(key);

            // 非本地路径过滤
            if (path && method && /^\//.test(path)) {
                // assert(!!app[method], `method of ${key} is not valid`);
                // assert(
                //     typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string',
                //     `mock value of ${key} should be function or object or string, but got ${typeof fn}`,
                // );

                // if (typeof fn === 'string') {
                //     if (/\(.+\)/.test(path)) {
                //         path = new RegExp(`^${path}$`);
                //     }
                //     // app.use(path, createProxy(method, path, fn));
                // } else {
                this.server[method](path, createMockHandler(method, path, fn));
                // }
            }
        });
        app.use(dmEnd);

        this.indexArr = this.server._router.stack.reduce(
            (r, { name }, index) => (['dmStart', 'dmEnd'].includes(name) ? [...r, index] : r),
            [],
        );
    };

    start = () => {
        try {
            this.createWatcher();
            this.bindServer();
        } catch (e) {
            console.log(e);
            console.log();
            // outputError(e);
            // this.createWatcher();
        }
    };
}

export default DM;
