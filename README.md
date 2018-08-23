                                ██████╗ ███╗   ███╗
                                ██╔══██╗████╗ ████║
                                ██║  ██║██╔████╔██║
                                ██║  ██║██║╚██╔╝██║
                                ██████╔╝██║ ╚═╝ ██║
                                ╚═════╝ ╚═╝     ╚═╝

<center>

# dataMock 数据模拟

[![download](https://img.shields.io/npm/dm/data-mock.svg)](https://www.npmjs.com/search?q=data-mock)
[![npm](https://img.shields.io/npm/v/data-mock.svg)](https://www.npmjs.com/search?q=data-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zhouzuchuan/data-mock/master/LICENSE)

</center>

以此来解决前后端分离开发中的痛点，模拟前端所需的数据。

## 下载

**npm**

```bash
npm install data-mock
```

**yarn**

```bash
yarn add data-mock
```

## 使用场景

-   前后端分离开发
-   关联数据模拟

## 使用方法

### 可以命令指定文件夹为  服务  目录

```bash
    # 全局安装
    npm i -g data-mock

    #指定 mocks文件夹为服务目录
    dm server -p ./mocks/
```

### 数据格式

```js
    // 模拟数据格式
    ['GET /test']: (req, res) => {
        return res.json({
            name: Random.cname(),
            time: Random.date()
        });
    }
```

格式：`[请求方式 请求接口]: 响应函数`

<center>

# 🚧 （抱歉！ 文档目前不完善，近期整理提交）

</center>
