#### webpack作用

* 代码转译
* 模块合并
* 混淆压缩
* 代码分隔
* 自动刷新
* 代码校验
* 自动部署
#### webpack安装

webpack是基于项目的打包工具，建议在项目中安装webpack
`npm i webpack webpack-cli -D`

#### 项目中使用webpack

##### webpack-cli

npm 5.2以上版本提供了一个`npx`命令

npx主要解决的问题，就是调用项目内部安装的模块，原理就是在`node_modules`下的`.bin`目录中找到对应的命令执行

使用webpack；`npx webpack`

webpack4.0之后可以实现零配置打包构建，零配置特点就是限制多，无法自定义很多配置

##### webpack配置

webpack四大核心概念
* 入口（entry):程序的入口
* 输出（output):打包后存放的位置
* loader:用于对模块源代码进行转换
* 插件（plugins)：解决loader无法实现的其他功能

1. webpack.config.js
2. 运行`npx webpack`

``````javascript
// webpack配置，遵循commonJs规范
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
        filename: 'bundle.js'
    },
    mode: 'development'     // mode默认production,区别就是代码是否混淆压缩
}
``````

##### 开发时自动编译工具

每次编译代码时，手动执行`npm run build`会很麻烦

webpack中有几个不同的选项，可以帮助我们自动编译代码：

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

大多数场景中，需要使用`webpack-dev-server`

###### watch

在`webpack`指令后面加上`--watch`参数即可

主要的作用就是监视本地项目文件的变化，发现有修改的代码会自动编译打包，生成输出文件

1. 配置`package.json`的scripts`"watch":webpack --watch`
2. 运行`npm run watch`
还可以通过配置文件对watch的参数进行修改

`````javascript
// webpack配置，遵循commonJs规范
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
        filename: 'bundle.js'
    },
    mode: 'development',     // mode默认production,区别就是代码是否混淆压缩
    watch: true
}
``````

###### webpack-dev-server

1. 安装`devServer`,`devServer`依赖`webpack`，必须在项目中安装webpack，`npm i webpack-dev-server webpack -D`
2. index.html中修改`<script src="/bundle.js"></script>`
3. 运行`npx webpack-dev-server `
4. 运行`npx webpack-dev-server --hot --open --port 8090`
5. 配置`package.json`中的scripts，`"dev": "webpack-dev-server --hot --open --port 8090"`
6. 运行`npm run dev`

cli配置： `"dev": "webpack-dev-server --hot --compress --contentBase src --open --port 8090"`
>  --contentBase src 指定项目根目录为src
>
> --open 自动打开
>
> --port 8090 指定端口号
>
> --hot 热更新-不需要重新打包bundle.js，以补丁的形式，修改哪里，改哪里
>
> --compress 开启gzip压缩
devServer会在内存中生成已经打包好的bundle.js,用于开发使用，打包效率高，修改代码后自动重新打包以及刷新浏览器。

还可以通过配置文件对DevServer的参数进行修改：
1. 修改`webpack.config.js`
``````javascript
    // 开启监视模式，监视文件的变化自动打包
    // watch: true,
    devServer: {
        open: true, //自动打开
        port: 3000, //端口
        hot: true,  //热更新
        compress: true, //gzip压缩
        contentBase: './src'    //根目录
    }
``````
2. 修改package.json中的scripts: `"dev": "webpack-dev-server"`

**注意：** webpack4.3版本以前配置使用hot，需要安装插件`webpack.HotModuleReplacementPlugin`才能使用热更新。如果使用`--hot`启用，则不需要。4.3版本以后不再需要插件

###### html插件

使用webpack-dev-server会默认打开配置的根目录，bundle.js生成在根目录下的内存中，我们需要`index.html`也在内存中生成一份，这就需要`htm-webpack-plugin`
1. 安装html-webpack-plugin插件`npm i html-webpack-plugin -D`
2. 在webpack.config.js中的`plugins`节点下配置

``````javascript
// 引入
let HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    // 将src下面的html生成一个新目录
    new HtmlWebpackPlugin({
        filename: 'index.html',  //打包后的名字
        template:  './src/index.html'   // 模板文件
    })
]
``````
1. 根据模板自动在内存中生成html(类似于devServer在内存中生成bundle.js)
2. 自动引入bundle.js
3. 打包时自动生成html文件，并引入bundle.js


###### webpack-dev-middleware

`webpack-dev-middleware`是一个容器，它可以吧webpack处理后的文件传递给服务器（server），`webpack-dev-server`在内部使用了它，同时它也可以作为一个单独的包使用，进行更多自定义设置

1. 安装`experss`和`webpack-dev-middleware`, `npm i express webpack-dev-middleware -D`
2. 新建service.js
``````javascript
// service.js
const express = require('express')
const webpack = require('webpack')
// 引入中间件
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const app = express()
const compiler = webpack(config)
// 注册中间件
app.use(webpackDevMiddleware(compiler, {
    publicPath: '/'
}))

app.listen(3000, function() {
    console.log('http://localhost:3000')
})
``````
3. 配置package.json中的scripts：`"server": "node service.js" `
4. 运行`npm run server`

注意：如果使用middleware,必须使用`html-webpack-plugin`插件，否则html文件无法正确的输出到express服务器的根目录

**注意**：在开发时才需要使用自动编译工具，eg:`webpack-dev-server`

项目上线直接使用webpack打包，不需要使用自动编译工具。

#### loader

###### 处理css

1. 安装`npm i css-loader style-loader -D`

``````javascript
module: {
        rules: [
            {
                test: /\.css$/, //匹配的文件后缀
                // webpack读取loader，从右向左读取，会将css交给最右侧的laoder,loader从右向左链式调用
                // css-loader解析css, style-loader将解析的结果放入HTML中
                use: ['style-loader', 'css-loader']
            }
        ]
    },

``````
###### 处理less

1. `npm i less less-loader -D`

``````javascript
{
    test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
}
``````

###### 处理scss
1. `npm i node-sass sass-loader -D`

``````javascript
{
    test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader']
}
``````

###### 处理图片和处理字体

1. `npm i file-loader url-loader -D`

url-loader依赖于file-loader

url-loader封装了file-loader
``````javascript
<!--使用url-loader-->
{
    test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: {loader: 'url-loader', options: {
        limit: 5 * 1024     // 图片小于5kb转换W为base64
    }}
}

<!--使用file-loader-->

{
    test: /\.(jpg|jpeg|gif|svg|bmp)$/, use: ['file-loader']
},
{
    test: /\.(woff|woff2|eot|svg|ttf)$/, use: ['file-loader']
}
``````
# webpack-mult-config
