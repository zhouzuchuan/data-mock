// Same as @apiParam
import apiParser from 'apidoc-core/lib/parsers/api_param.js';
// var apiParser = require('./api_param.js');

function parse(content: any, source: any) {
    const { description = '', ...other } = apiParser.parse(content, source, 'Success 200');
    var match = description.match(/^((\[(\S*)\])*\s*(\{(\S*)\})*\s+)+/);

    var result = {
        ...other,
        ...(match
            ? { description: description.replace(match[0], ''), mock: match[3], mockSize: match[5] }
            : {
                  description,
              }),
    };

    return result;
}

function path() {
    return 'local.success.fields.' + apiParser.getGroup();
}

/**
 * Exports
 */
module.exports = {
    parse: parse,
    path: path,
    method: apiParser.method,
    markdownFields: ['description', 'type'],
    markdownRemovePTags: ['type'],
};
