const Mock = require('mockjs');

const { DM } = global;

module.exports = {
    ['get /tokenw']: (req, res) =>
        res.json(
            Mock.mock({
                message: '@ctitle()',
                status: '1',
                'result|3': {
                    pagesize: '@natural(10,20)',
                    pageIndex: 2233,
                    'dataList|3-10': [{ id: '@guid()', age: '@natural(10,100)' }],
                },
            }),
        ),
    ['get /info']: (req, res) => res.json(DM),
};
