const express = require('express');
const path = require('path');
const chalk = require('chalk');
const url = require('url');
const { applyMock } = require('./cjs');
const { choosePort, openBrowser } = require('./server-util');

const server = ({ open, path }) => {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 1024;
    const HOST = process.env.HOST || 'localhost';

    choosePort(HOST, DEFAULT_PORT)
        .then(port => {
            if (port == null) {
                return;
            }

            const server = express();
            applyMock({
                server,
                path: path.resolve(__dirname, path || './')
            });
            server.listen(port, HOST, err => {
                if (err) {
                    return console.log(err);
                }
                console.log('');
                console.log(chalk.green(`DM server started successfully`));
                console.log(`listen port ${chalk.cyan(port)}`);
                console.log('');

                open &&
                    openBrowser(
                        url.format({
                            protocol,
                            hostname: HOST,
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
