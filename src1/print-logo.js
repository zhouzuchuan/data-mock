module.exports = function() {

    const pkg = require('../package');
    console.log('');
    console.log('');
    console.log(
        chalk.cyan(`
    ██████╗ ███╗   ███╗
    ██╔══██╗████╗ ████║
    ██║  ██║██╔████╔██║
    ██║  ██║██║╚██╔╝██║
    ██████╔╝██║ ╚═╝ ██║
    ╚═════╝ ╚═╝     ╚═╝
    `)
    );
    console.log('');
    console.log('data-mock version ' + pkg.version);
    console.log('');
}