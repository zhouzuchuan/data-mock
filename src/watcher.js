// import chokidar from 'chokidar';

const chokidar = require('chokidar');
const chalk = require('chalk');

import { bindServer } from './apply-mock';
import store from './store';

const createWatcher = ({ server, applyBefore = f => f }) => {
    const watcher = chokidar.watch([store.target, ...store.watchTarget], {
        persistent: true,
        ignored: /(^|[\/\\])\..*(?<!\.js)$/, //忽略点文件
        cwd: '.', //表示当前目录
        depth: 99 //到位了....
    });
    watcher.on('change', path => {
        console.log(chalk.bgCyan(chalk.white(' DM ')), chalk.cyan('CHANGED'), path);
        watcher.close();
        applyBefore();
        bindServer({ server });
    });
};

export default createWatcher;
