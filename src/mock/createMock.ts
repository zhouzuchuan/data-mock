const path = require('path');
const which = require('which');
const chalk = require('chalk');
const fs = require('fs');
const fs2 = require('fs-extra');

const commitParser = require('comment-parser');
const chokidar = require('chokidar');

const zh = data =>
    Object.entries(data).reduce(
        (r, [method, apis]) => ({
            ...r,
            ...Object.entries(apis).reduce(
                (r2, [name, path]) => ({
                    ...r2,
                    [name]: [method, path],
                }),
                {},
            ),
        }),
        {},
    );

const createApiDoc = (data, apis, options) => {
    let isGroup = false;

    const cc = data.reduce((r, { tags, description }) => {
        // 如果没有标注 则返回空
        if ((tags[0] || {}).tag !== 'api') {
            return '';
        }
        let mockTpl = '';
        let title = '';
        let mockInterface = [];

        const docs = tags.reduce((r2, o) => {
            if (o.tag === 'apiName') {
                mockInterface = apis[o.name];
                title = o.description;
            }

            if (o.tag === 'apiGroup') {
                isGroup = true;
            }

            if (o.tag === 'api') return r2;

            if (o.tag === 'example') {
                mockTpl = `${o.name}${o.description}`.replace(/\n| /g, '').replace(/\$/g, '@');

                return r2;
            }

            return `${r2}
        * ${o.source}`;
        }, '');

        const [method, path] = mockInterface;

        return `
        /**
        * @api {${method}} ${path} ${title}
            ${!isGroup ? `* @apiGroup: ${options.filename}` : ''}
        ${docs}
        @apiSampleRequest ${path}
        */
        ['${method} ${path}']:(req, res) => res.json(Mock.mock(${mockTpl})),
        `;
    }, '');

    if (cc === '') {
        return '';
    }

    return `
const Mock = require('mockjs')

module.exports = {
    ${cc}
}
    `;
};

const createMockFile = (filepath, outputDir) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) throw err;

        const formatData = commitParser(data) || {};

        // 没有注释 返回
        if (!formatData.length) return;

        const result = require(path.resolve(process.cwd(), filepath));
        const text = createApiDoc(commitParser(data), zh(result), { filename: path.basename(filepath, '.js') });

        const tempPath = path.join(outputDir, path.basename(filepath));

        // 没有标准注释 则返回并且删除
        if (text === '') {
            fs2.remove(tempPath, err => {
                if (err) throw err;
            });
            return;
        }

        fs2.outputFile(tempPath, text, err => {
            if (err) throw err;
        });
    });
};

export const createMock = (inputDir, outputDir) => {
    const watcher = chokidar.watch([inputDir], {
        persistent: true,
        ignored: /(^|[\/\\])\..*(?<!\.js)$/, //忽略点文件
        cwd: '.', //表示当前目录
        depth: 99, //到位了....
    });
    watcher
        .on('add', filepath => {
            console.log(chalk.bgGreen(chalk.white(' Watch Mock ')), chalk.green('ADD'), filepath);
            createMockFile(filepath, outputDir);
            // watcher.close();
        })
        .on('unlink', filepath => {
            console.log(chalk.bgRed(chalk.white(' Watch Mock ')), chalk.red('REMOVE'), filepath);

            const tempPath = path.join(outputDir, path.basename(filepath));
            fs2.remove(tempPath, err => {
                if (err) throw err;
            });
            // watcher.close();
        })
        .on('change', filepath => {
            console.log(chalk.bgCyan(chalk.white(' Watch Mock ')), chalk.cyan('CHANGED'), filepath);
            createMockFile(filepath, outputDir);
            // watcher.close();
        });
};

// const cc = {
//     'message|1': '@ctitle',
//     'status|1': [100, 200],
//     'result|3': {
//         'pagesize|1': '@natural(100,300)',
//         'pageIndex|1': 10,
//         'dataList|3-10': [{ 'id|1': '@guid', 'age|1': '@natural(10,20)' }],
//     },
// };

// const statistics = (object, path = '') => {
//     return Object.entries(object).reduce((r, [k, v]) => {
//         const { properties, type, ...other } = v;

//         const dealpath = path === '' ? k : `${path}.${k}`;

//         return {
//             ...r,
//             [dealpath]: { type, ...other },
//             ...(['object', 'array'].includes(type) && statistics(properties, dealpath)),
//         };
//     }, {});
// };
// const createMockTpl = object => {
//     return Object.entries(object).reduce((r, [k, v]) => {
//         const { type } = v;
//         if (type === 'array') {
//             const { properties, limit = 1 } = v;
//             return {
//                 ...r,
//                 [`${k}|${limit}`]: [createMockTpl(properties)],
//             };
//         } else if (type === 'object') {
//             const { properties, limit = null } = v;
//             return {
//                 ...r,
//                 [`${k}|${limit === null ? Object.keys(properties).length : limit}`]: createMockTpl(properties),
//             };
//         } else {
//             const { tpl, limit = 1 } = v;
//             return {
//                 ...r,
//                 [`${k}|${limit}`]: tpl,
//             };
//         }
//     }, {});
// };

// const generateFieldDoc = obj => {
//     return `
//     const Mock = require('mockjs')

//     module.export = {

//         ${Object.entries(obj).reduce(
//             (r, [path, data]) => {
//                 const [url, method] = path.split(' ').reverse();

//                 const { name, description, group, version, responses, parameters } = data;

//                 const mockTpl = createMockTpl(responses.default.schema);

//                 const a = statistics(responses.default.schema);

//                 return `
//                 ${r}

//                 /**
//                  * @api {${method}} ${url} ${name}
//                  * @apiDescription ${description}
//                  * @apiName ${name}
//                  * @apiGroup ${group}

//                  ${Object.entries(parameters).reduce((r2, [key, { type, name }]) => {
//                      return `
//                    ${r2}
//                    * @apiParam {${type}} ${key} ${name}
//                    `;
//                  }, '')}
//                  * @apiParamExample {json} Param-Response:
//                  *  {
//                  ${Object.entries(parameters).reduce((r2, [key, { type }]) => {
//                      return `
//                    ${r2}
//                    *    ${key}: ${type}
//                    `;
//                  }, '')}
//                  *  }
//                  ${Object.entries(a).reduce((r2, [p, { type, name }]) => {
//                      return `
//                     ${r2}
//                     * @apiSuccess {${type}} ${p} ${name}
//                     `;
//                  }, '')}
//                  * @apiSampleRequest ${url}
//                  * @apiVersion ${version}
//                  */

//                 ['${[path]}']: () => Mock.mock(${JSON.stringify(mockTpl)}),

//                 `;
//             },
//             `
//             `,
//         )}

//     }

//     `;
// };
