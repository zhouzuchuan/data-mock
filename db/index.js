const { Random } = require('mockjs');

module.exports = {
    ['GET /test']: (req, res) => {
        return res.json({
            name: Random.cname(),
            time: Random.date()
        });
    }
};
