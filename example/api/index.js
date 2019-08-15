module.exports = {
    get: {
        /**
         *
         * @api {get} /ageList 获取年龄列表
         * @apiName GetUser
         * @apiDescription
         * # input输入地点之后，点击搜索查询 触发
         * ```js
         * console.log('dddd')
         * ```
         *
         *
         * @apiGroup Auth
         *
         * @apiParam   {String}   address               地点
         *
         * @apiSuccess {String}   message               状态介绍
         *
         * @apiSuccess {String}   [status=10 ]               状态码
         * ## `10`
         * ```js
         * console.log('dddd')
         * ```
         *
         * @apiSuccess {Object}   result                {@date} 结果
         * @apiSuccess {Number}   result.pagesize       返回数量
         * @apiSuccess {Number}   result.pageIndex      返回页数
         * @apiSuccess {[Object]} result.dataList        {0-10} 数据列表
         * @apiSuccess {String}   result.dataList.id    唯一标识id
         * @apiSuccess {String}   result.dataList.age   [@date] {10} 年龄
         *
         */

        apiGetToken: '/ageList',
    },
};
