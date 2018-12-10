const express = require('express');
const path = require('path');
const chalk = require('chalk');
const url = require('url');
const printLogo = require('./print-logo');
const { bindServer } = require('./lib');
const { choosePort, openBrowser } = require('./server-util');

const address = require('address');

const server = program => {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 1024;
    const HOST = process.env.HOST || '0.0.0.0';

    choosePort(HOST, DEFAULT_PORT)
        .then(port => {
            if (port == null) {
                return;
            }

            const server = express();
            bindServer({
                server,
                target: path.resolve(__dirname, program.target || process.cwd()),
                ...(program.watchTarget ? { watchTarget: path.resolve(__dirname, program.watchTarget) } : {})
            });
            server.listen(port, HOST, err => {
                if (err) {
                    return console.log(err);
                }

                printLogo();

                console.log('Listen to: ');
                console.log('');
                console.log(chalk.cyan(`Local:            http://localhost:${port}`));
                console.log(chalk.cyan(`On Your Network:  http://${address.ip()}:${port}`));
                console.log('');
                console.log(chalk.bgCyan(chalk.white(' DM ')), chalk.green(`Server started successfully`));
                console.log('');

                program.open &&
                    openBrowser(
                        url.format({
                            protocol,
                            // hostname: HOST,
                            port,
                            pathname: '/'
                        })
                    );
            });
        })
        .catch(err => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        });
};

module.exports = server;
