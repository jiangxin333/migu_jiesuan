const Compression = require('compression-webpack-plugin')
const debug = process.env.NODE_ENV === 'production'
module.exports = {
    publicPath: debug ? '/static/' : '/',
    
    productionSourceMap: false, //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    configureWebpack:config => {    // gzip压缩
        if (debug) {
            return {
                plugins: [new Compression({
                    test: /\.js$|\.html$|\.css/,    // 匹配文件名
                    threshold: 10240,               // 对超过10k的数据进行蒴
                    deleteOriginalAssets: false,    // 是否删除源文件
                })]
            }
        }
    },
	css: {
        loaderOptions: {
            css: {
                // options here will be passed to css-loader
            },
            postcss: {
                // options here will be passed to postcss-loader
                plugins: [require('postcss-px2rem')({
                    remUnit:38
                })]
            }
        }
    },
    lintOnSave: undefined
}