const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = path.join(__dirname, '/db');
const files = fs.readdirSync(db);

require('./store');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

Object.entries(
    files.reduce((r, v) => {
        return {
            ...r,
            ...require(path.resolve(db, v))
        };
    }, {})
).reduce((r, [n, m]) => {
    const [path, mothed = 'all'] = n
        .split(' ')
        .slice(0, 2)
        .reverse();
    r[mothed.toLowerCase()](path, m);
    return r;
}, router);

app.use('/', router);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'));
});

app.listen(1024, () => {
    console.log('dataMock 服务启动!');
});
