import express from 'express';
import chalk from 'chalk';
import url from 'url';
import { ip } from 'address';
import DataMock, { IdmOptions } from './index';

import choosePort from './utils/choosePort';
import openBrowser from './utils/openBrowser';

import { printLogo, warnbg, warn } from './utils/tools';

type Tserver = {
    open: boolean;
    port: number;
    version: string;
};

const server = ({ open, port, version, ...options }: Tserver & IdmOptions) => {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const DEFAULT_PORT = port || 1024;
    const HOST = process.env.HOST || '0.0.0.0';

    choosePort(HOST, DEFAULT_PORT)
        .then((port: number) => {
            if (port == null) {
                return;
            }

            const server = express();

            new DataMock(server, options);

            server.listen(port, HOST, ( ) => {
                
                    printLogo(version);

                    console.log('Listen to: ');
                    console.log('');
                    console.log(warn(`Local:            ${protocol}://localhost:${port}`));
                    console.log(warn(`On Your Network:  ${protocol}://${ip()}:${port}`));
                    console.log('');
                    console.log(warnbg(' DM '), chalk.green(`Server started successfully`));
                    console.log('');
    
                    open &&
                        openBrowser(
                            url.format({
                                protocol,
                                // hostname: HOST,
                                hostname: 'localhost',
                                port,
                                pathname: '/',
                            }),
                        ); 
               
            });
        })
        .catch((err: Error) => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        });
};

export default server;
