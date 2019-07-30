const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
module.exports = merge(baseConfig, {
    mode: 'production',     // mode默认production,区别就是代码是否混淆压缩
    devtool: 'none'
})
