
const chalk = require('chalk');

module.exports = function() {
    const pkg = require('./package');
    console.log('');
    console.log('');
    console.log(
        chalk.cyan(`
    ██████╗ ███╗   ███╗
    ██╔══██╗████╗ ████║
    ██║  ██║██╔████╔██║
    ██║  ██║██║╚██╔╝██║
    ██████╔╝██║ ╚═╝ ██║
    ╚═════╝ ╚═╝     ╚═╝   ${chalk.bgCyan(chalk.white(` v${pkg.version} `))}
    `)
    );
    console.log('');
}