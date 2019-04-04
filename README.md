```
██████╗ ███╗   ███╗
██╔══██╗████╗ ████║
██║  ██║██╔████╔██║
██║  ██║██║╚██╔╝██║
██████╔╝██║ ╚═╝ ██║
╚═════╝ ╚═╝     ╚═╝
```

<p align="center">

# dataMock 轻量级数据模拟

[![download](https://img.shields.io/npm/dm/data-mock.svg)](https://www.npmjs.com/search?q=data-mock)
[![npm](https://img.shields.io/npm/v/data-mock.svg)](https://www.npmjs.com/search?q=data-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zhouzuchuan/data-mock/master/LICENSE)

</p>

## 它是什么

-   旨在帮助广大泛前端开发人员，解决数据模拟、数据对接等开发瓶颈，提高开发效率
-   一款基于 [Express](https://github.com/expressjs/express) 的轻量级数据模拟服务
-   引入了业界优秀的数据模拟工具 [Mockjs](https://github.com/nuysoft/Mock)，如果你可以跳墙，也可以试试这个神器 [Faker.js](https://github.com/Marak/faker.js)、[chancejs](https://github.com/chancejs/chancejs)

## 优势

-   轻量，随起随用
-   支持自定义模拟请求参数响应回调
-   支持绑定 web 前端框架 [React](https://github.com/facebook/react)、 [Vue](https://github.com/vuejs/vue) 等，实现模拟功能
-   降低不可抗力带来的开发失落感，如：断网、停电、服务器挂掉等诸如此类 😁
-   了解后端逻辑，成为优秀的全栈开发大牛奠定思维逻辑基础（只能帮到这了，机缘只能看各位的造化了 😂）

## 下载

建议全局安装，随起随用

**npm**

```bash
npm install -g data-mock
```

**yarn**

```bash
yarn add global data-mock
```

## 如何用

### 目标服务目录

该目录下的所有 js 文件都会被监听以及读取载入挂在到路由上，具体写法可以参考这个 [example](https://github.com/zhouzuchuan/dataMock/tree/master/example)，或者 [download](https://github.com/zhouzuchuan/api-manage/archive/master.zip) 项目，下载依赖后， `yarn start` 查看效果

    .开头的文件（如：.store.js）则会被载入到 node 中的 `global.DM` 对象上，主要是用来存储各个请求的默认数据，可以用来做更多好玩的东西，如：关联数据模拟等

目标服务目录的 js 格式，建议采用 es6 的（在问为什么要用 es6 之前，先问下自己为啥不用）

PS: 请提前检测下自己电脑安装的 node 支持何种程度的 es6，可以使用这个工具来检测 [es-checker](https://github.com/ruanyf/es-checker)

数据格式：`[请求方式 请求接口]: 响应函数`

```js
    // 模拟数据格式
    ['GET /test']: function(req, res) {
        return res.json({
            name: Random.cname(),
            time: Random.date()
        });
    }
```

### 全局使用

```bash
    # 当前目录为目标服务目录 并启动服务
    dm server

    # 指定mocks文件夹为目标服务目录 并启动服务
    dm server -t ./mocks/
```

### 现代前端框架 [webpack](https://github.com/webpack/webpack) 中使用

`data-mock` 暴露一个方法 `bindServer`，用来绑定 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 暴露的 server 对象

```js
const { bindServer } = require('data-mock');
const path = require('path')

// ...

// webpack 中webpack-dev-server 配置
devServer: {
    //  绑定mock server
    after: server => {
        bindServer({
            server,
            target: path.resolve(__dirname, './src/mocks/')

            // 监控目录（这里声明的目录有变动，则服务数据刷新，主要用来监控api变动）
            // 如果不需要则不写
            // 和上面target一样，必须通过 path.resolve 找到相对于项目的真实路径，否则可能出现监控不准确
            watchTarget: []
        });
    };
}
```

`watchTarget` 搭配 [api-manage](https://github.com/zhouzuchuan/api-manage) 使用效果更佳

## License

[MIT](https://tldrlegal.com/license/mit-license)

#### 🎉🎉🎉🎉 如果您觉的还可以，求点个 star 🎉🎉🎉🎉
