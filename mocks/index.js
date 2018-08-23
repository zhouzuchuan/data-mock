const { Random } = require('mockjs');

module.exports = {
    ['get /chuan']: (req, res) => {
        return res.json({
            name: Random.cname(),
            time: Random.date(),
            chuan: 'dddddddd'
        });
    },
    ['get /chuan2']: '33'
};
