import chokidar, { FSWatcher } from 'chokidar';
import chalk from 'chalk';
import glob from 'glob';
import bodyParser from 'body-parser';
import httpProxyMiddle from 'http-proxy-middleware';
import { dealPath, createMockHandler, winPath, warn, warnbg, error, errorbg, judge } from './utils/tools';

const DMTAG = (...arg: any[]) => arg[2]();

const requireFile = (files: string[]) => {
    let count: any = {};

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
            console.log(`${errorbg(` ${v} `)} 文件格式不符合要求，已过滤！`);

            return r;
        }
    }, {});

    Object.entries(count)
        .filter(([k, v]: any) => v.length > 1)
        .forEach(([k, v]: any) => {
            let [path, method] = dealPath(k);
            console.log('');
            console.log(
                chalk.bgYellow(chalk.white(`${method}`)),
                chalk.yellow(path),
                '出现次数：',
                errorbg(chalk.bold(v.length)),
            );
            v.forEach((o: string) => {
                console.log(`  ${warnbg(o)}`);
            });
            console.log('');
        });

    return result;
};

export interface IdmOptions {
    target: string;
    watchTarget: string;
}
class DM {
    private target: string = '';
    private watchTarget: string[] = [];
    private apidocTarget: string = '';
    private indexArr: any[] = [];
    private server: any;
    private watcher: FSWatcher | null = null;

    constructor(server: any, { target, watchTarget }: IdmOptions) {
        this.target = target;
        this.server = server;
        this.watchTarget = Array.isArray(watchTarget) ? watchTarget : [watchTarget];

        server.use(bodyParser.json({ limit: '5mb', strict: false }));
        server.use(
            bodyParser.urlencoded({
                extended: true,
                limit: '5mb',
            }),
        );

        this.start();
    }

    createWatcher = () => {
        this.watcher = chokidar.watch([this.target, ...this.watchTarget], {
            persistent: true,
            ignored: /(^|[\/\\])\..*(?<!\.js)$/, //忽略点文件
            cwd: '.', //表示当前目录
            depth: 99, //到位了....
        });
        this.watcher.on('change', path => {
            console.log(warnbg('DM'), warn('CHANGED'), path);
            this.bindServer();
        });
    };

    // 清除缓存
    clearCache = () => {
        // 删除旧的mock
        if (this.indexArr.length) {
            const min = Math.min(...this.indexArr);
            const max = Math.max(...this.indexArr);
            this.server._router.stack.splice(min, max - min + 1);
        }

        Object.keys(require.cache).forEach(file => {
            if ([...this.watchTarget, this.target].some(v => file.includes(v))) {
                console.log(error('Delete Cache'), file);
                delete require.cache[file];
            }
        });
    };

    bindServer = () => {
        const db = this.target;

        const app = this.server;

        // 注入store
        // global.DM = requireFile(glob.sync(db + '/.*.js'));

        this.clearCache();

        app.use(DMTAG);
        // 添加路由
        Object.entries(requireFile(glob.sync(db + '/!(.)*.js'))).forEach(([key, fn]) => {
            const [path, method] = dealPath(key);

            // 非本地路径过滤
            if (path && method && /^\//.test(path)) {
                judge(!app[method], `method of ${key} is not valid`);
                judge(
                    !(typeof fn === 'function' || typeof fn === 'object' || typeof fn === 'string'),
                    `mock value of ${warn(key)} should be function or object or string, but got ${error(typeof fn)}`,
                );

                if (typeof fn === 'string') {
                    app.use(
                        /\(.+\)/.test(path) ? new RegExp(`^${path}$`) : path,
                        httpProxyMiddle(
                            (pathname, req: any) => (method ? req.method.toLowerCase() === method.toLowerCase() : true),
                            {
                                target: winPath(fn),
                            },
                        ),
                    );
                } else {
                    this.server[method](path, createMockHandler(fn));
                }
            }
        });
        app.use(DMTAG);

        this.indexArr = this.server._router.stack.reduce(
            (r: number[], { name }: { name: string }, index: number) => (name === DMTAG.name ? [...r, index] : r),
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
