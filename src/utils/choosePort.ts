import chalk from 'chalk';
import detect from 'detect-port-alt';
import inquirer, { ConfirmQuestion } from 'inquirer';

function clearConsole() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

const choosePort = (host: string, defaultPort: number) => {
    return detect(defaultPort, host).then(
        (port: number) =>
            new Promise(resolve => {
                if (port === defaultPort) {
                    return resolve(port);
                }
                const message =
                    // process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
                    process.platform !== 'win32' && defaultPort < 1024
                        ? `Admin permissions are required to run a server on a port below 1024.`
                        : `Something is already running on port ${defaultPort}.`;
                if (process.stdout.isTTY) {
                    clearConsole();
                    const question: ConfirmQuestion<any> = {
                        type: 'confirm',
                        name: 'shouldChangePort',
                        message: chalk.yellow(message) + '\n\nWould you like to run the app on another port instead?',
                        default: true,
                    };
                    inquirer.prompt(question).then((answer: { shouldChangePort: boolean }) => {
                        if (answer.shouldChangePort) {
                            resolve(port);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    console.log(chalk.red(message));
                    resolve();
                }
            }),
        (err: Error) => {
            throw new Error(
                chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
                    '\n' +
                    ('Network error message: ' + err.message || err) +
                    '\n',
            );
        },
    );
};

export default choosePort;
