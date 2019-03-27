const express = require('express');
const path = require('path');
const chalk = require('chalk');
const url = require('url');
const which = require('which');
const printLogo = require('./print-logo');
const { bindServer, createMock } = require('./lib');
const { choosePort, openBrowser } = require('./server-util');

const address = require('address');

// var swaggerUi = require('swagger-ui-express');
// var swaggerJSDoc = require('swagger-jsdoc');

// var swaggerDefinition = {
//     info: {
//         title: 'Swagger API',
//         version: '1.0.0',
//         description: 'Swagger 接口文档',
//     },
//     // host: 'localhost:3000',
//     basePath: '/',
// };

// // options for the swagger docs
// var options = {
//     // import swaggerDefinitions
//     swaggerDefinition: swaggerDefinition,
//     // path to the API docs
//     apis: [path.resolve(__dirname, program.target || process.cwd()) + '/*.js'],
// };

// // initialize swagger-jsdoc
// var swaggerSpec = swaggerJSDoc(options);

// // serve swagger
// server.get('/swagger.json', function(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
// });

// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * 启动命令
 */
function runCmd(cmd, args, fn) {
    args = args || [];
    let runner = require('child_process').spawn(cmd, args, {
        // keep color
        stdio: 'inherit',
    });
    runner.on('close', function(code) {
        if (fn) {
            fn(code);
        }
    });
}

/**
 * 是否安装git
 * */

const findApidoc = () => {
    let apidoc = `apidoc${process.platform === 'win32' ? '.cmd' : ''}`;
    try {
        which.sync(apidoc);
        return apidoc;
    } catch (e) {
        log(e);
    }
    throw new Error('please install apidoc');
};

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

            const apidocTarget =
                program.apidocTarget ||
                path.join(path.resolve(__dirname, program.target || process.cwd()), '../dm-apidoc');

            server.use('/', express.static(apidocTarget));

            bindServer({
                server,
                target: path.resolve(__dirname, program.target || process.cwd()),
                ...(program.watchTarget ? { watchTarget: path.resolve(__dirname, program.watchTarget) } : {}),
                apidocTarget,
            });

            // createMock(
            //     path.resolve(__dirname, program.watchTarget),
            //     path.resolve(__dirname, program.target || process.cwd()),
            // );

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
                            pathname: '/',
                        }),
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
