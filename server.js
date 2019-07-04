const express = require('express')
const webpack = require('webpack')
// 引入中间件
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const app = express()
const compiler = webpack(config)
// 注册中间件
app.use(webpackDevMiddleware(compiler, {
    publicPath: '/' //输出的目录
}))

app.listen(3000, function() {
    console.log('http://localhost:3000')
})
