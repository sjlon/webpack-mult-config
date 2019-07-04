// webpack配置，遵循commonJs规范
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // output.path必须为绝对路径
        filename: 'custombundle.js'
    },
    mode: 'development'     // mode默认production,区别就是代码是否混淆压缩
}
