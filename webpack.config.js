// webpack配置，遵循commonJs规范
const path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
require('@babel/polyfill')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
let resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
	// entry: ['@babel/polyfill', './src/index.js'],
	// output: {
	// 	path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
	// 	filename: 'bundle.js',
	// 	publicPath: '/'
	// },
	entry: {
		index: resolve('./src/index.js'),
		other: resolve('./src/other.js')
	},
	output: {
		filename: '[name][hash].js',
		publicPath: '/'
	},
	// output: {
	// 	filename: '[name].js',
	// 	publicPath: './',
	// 	path: path.resolve(__dirname, '/dist')
	// },
	mode: 'development',     // mode默认production,区别就是代码是否混淆压缩
	// mode: 'production',     // mode默认production,区别就是代码是否混淆压缩
	// 开启监视模式，监视文件的变化自动打包
	// watch: true,
	devServer: {
		open: true, //自动打开
		port: 3000, //端口
		hot: true,  //热更新
		compress: true, //gzip压缩
		contentBase: './'    //根目录
	},
	plugins: [
		// 将src下面的html生成一个新目录
		new HtmlWebpackPlugin({
			filename: 'index.html', //打包后的名字
			template: './src/index.html' // 模板文件
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, 'assets'),
			to: 'assets'
		}]),
		new webpack.BannerPlugin('webpack BanenrPlugin添加注释信息')
	],
	module: {
		rules: [
			{
				test: /\.css$/, //匹配的文件后缀
				// webpack读取loader，从右向左读取，会将css交给最右侧的laoder,loader从右向左链式调用
				// css-loader解析css, style-loader将解析的结果放入HTML中
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: [{
					loader: 'url-loader', options: {
						limit: 5 * 1024,     // 图片小于5kb转换W为base64
						outputPath: 'images',    //指定图片的输出目录
						name: '[name]-[hash:4].[ext]'    //图片文件重命名
					}
				}]
			},
			{
				test: /\.(woff|woff2|eot|svg|ttf)$/, use: ['url-loader']
			},
			{
				test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':src', ':data-src']
					}
				}
			}
			// {
			//     test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: ['file-loader']
			// },
			// {
			//     test: /\.(woff|woff2|eot|svg|ttf)$/, use: ['file-loader']
			// }
		]
	},
	devtool: 'cheap-module-eval-source-map'
}
