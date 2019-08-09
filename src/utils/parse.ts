var data = [
    {
        group: 'Success 200',
        type: 'String',
        optional: false,
        field: 'message',
        description: '<p>状态介绍</p>',
    },
    {
        group: 'Success 200',
        type: 'String',
        optional: true,
        field: 'status',
        defaultValue: '10',
        description:
            '<p>状态码</p> <h2><code>10</code></h2> <pre><code class="language-js">console.log(\'dddd\') </code></pre>',
    },
    {
        group: 'Success 200',
        type: 'Object',
        optional: false,
        field: 'result',
        description: '<p>结果</p>',
        mockSize: '@date',
    },
    {
        group: 'Success 200',
        type: 'Number',
        optional: false,
        field: 'result.pagesize',
        description: '<p>返回数量</p>',
    },
    {
        group: 'Success 200',
        type: 'Number',
        optional: false,
        field: 'result.pageIndex',
        description: '<p>返回页数</p>',
    },
    {
        group: 'Success 200',
        type: '[Object]',
        optional: false,
        field: 'result.dataList',
        description: '<p>数据列表</p>',
    },
    {
        group: 'Success 200',
        type: 'String',
        optional: false,
        field: 'result.dataList.id',
        description: '<p>唯一标识id</p>',
    },
    {
        group: 'Success 200',
        type: 'String',
        optional: false,
        field: 'result.dataList.age',
        description: '<p>年龄</p>',
        mock: '@date',
        mockSize: '10',
    },
];

const createObject = data => {
    data.reduce((r, { field, type, mockSize, mock }: any) => {
        var key = field;
        var value = '';

        return {
            ...r,
            [`${key}|${mockSize}`]: value,
        };
    }, {});
};
