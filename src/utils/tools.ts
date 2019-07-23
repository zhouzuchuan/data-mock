import chalk from 'chalk';

/**
 *
 * 修正windon路径问题
 *
 * @param {*} path
 */
export const winPath = (path: string): string => path.replace(/\\/g, '/');

export const createMockHandler = (value: any) => (...args: any[]): void => {
    if (typeof value === 'function') {
        value(...args);
    } else {
        args[1].json(value);
    }
};

/**
 *
 * 提取方法以及路径
 *
 * @param {*} key
 */
export const dealPath = (key: string): string[] =>
    key
        .split(' ')
        .slice(0, 2)
        .reverse()
        .map((v: string) => v.toLowerCase());

export const outputError = (error: any): void => {
    if (!error) return;

    const filePath = error.message.split(': ')[0];
    const relativeFilePath = filePath;
    const errors = error.stack
        .split('\n')
        .filter((line: string) => line.trim().indexOf('at ') !== 0)
        .map((line: string) => line.replace(`${filePath}: `, ''));
    errors.splice(1, 0, ['']);

    console.log(chalk.red('Failed to parse mock config.'));
    console.log();
    console.log(`Error in ${relativeFilePath}`);
    console.log(errors.join('\n'));
    console.log();
};

export const error = (str: string): string => chalk.red(` ${str} `);
export const warn = (str: string): string => chalk.cyan(` ${str} `);

export const errorbg = (str: string): string => chalk.bgRed(chalk.white(` ${str} `));
export const warnbg = (str: string): string => chalk.bgCyan(chalk.white(` ${str} `));

export const judge = (bool: boolean, str: string): void => {
    if (bool) console.log(str);
};

export const printLogo: (version: string) => void = (version: string): void => {
    console.log('');
    console.log('');
    console.log(
        warn(`
    ██████╗ ███╗   ███╗
    ██╔══██╗████╗ ████║
    ██║  ██║██╔████╔██║
    ██║  ██║██║╚██╔╝██║
    ██████╔╝██║ ╚═╝ ██║
    ╚═════╝ ╚═╝     ╚═╝   ${warnbg(` v${version} `)}
    `),
    );
    console.log('');
};
