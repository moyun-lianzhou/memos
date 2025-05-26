const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connect_mongodb = require('./mongodb/index')
const rateLimit = require('express-rate-limit');

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: './prod.env' });
} else {
  require('dotenv').config({ path: './dev.env' });
}
require('dotenv').config()

const app = express(); // 创建express实例

// IP限流器，针对于所有路由
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分钟
    max: 100, // 每个 IP 每分钟最多请求 100 次
    message: {
        status: 429,
        msg: '请求过于频繁，请稍后再试', // 自定义消息
    },
    headers: true, // 返回限流信息的 HTTP 头部
});

// 浏览器同源策略-允许跨域
const allowedOrigins = ['http://localhost:5173', 'http://www.moyunlianzhou.cn', 'http://moyunlianzhou.cn', 'http://127.0.0.1:5500'];
app.use(cors({
    // 前端地址
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    credentials: true,
    exposedHeaders: ['x-refresh-token'], // 允许前端访问这个自定义头部
  }));

// 中间件
app.use(logger('dev'));
app.use(express.json()); // 针对请求体的中间件
app.use(express.urlencoded({ extended: false })); // 针对请求体的中间件
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 静态资源路径中间件
app.use('/uploads', express.static(path.join(__dirname, 'upload/photos'))); // 静态资源路径中间件-负责存储上传图片
app.use(limiter); // 将限流器应用于所有请求

// 引入路由
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRoute');
const photoRouter = require('./routes/photoRoute');
const albumRouter = require('./routes/albumRoute');

// 设置路由前缀
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/photo', photoRouter);
app.use('/album', albumRouter);
// 只对特定路由进行限流
// app.use('/api', limiter);

// 连接mongodb数据库
connect_mongodb()
// 处理 404 错误
app.use(function (req, res, next) {
    res.status(404).send('未找到该页面');
});


module.exports = app;
