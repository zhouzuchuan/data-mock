const { Random } = require('mockjs');

const { DM } = global;

module.exports = {
    ['get /token']: (req, res) => {
        return res.json({
            creator: Random.cname(),
            lastTime: Random.date(),
            value: '可以修改我来测试接口是否是实时监听-1000',
            ...DM
        });
    }
};
