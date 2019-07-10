const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
module.exports = merge(baseConfig, {
	devServer: {
		open: true, //自动打开
		port: 3000, //端口
		hot: true, //热更新
		compress: true, //gzip压缩
		contentBase: './' //根目录
	},
	mode: 'development', // mode默认production,区别就是代码是否混淆压缩
	devtool: 'cheap-module-eval-source-map'
})
