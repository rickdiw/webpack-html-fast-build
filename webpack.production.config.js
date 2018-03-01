/**
 * Created by huangyh(黄永号) on 2017/11/29.
 */

let path = require("path");
let glob = require("glob");
let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");//将你的行内样式提取到单独的css文件里，
let HtmlWebpackPlugin = require("html-webpack-plugin"); //html模板生成器
let CleanPlugin = require("clean-webpack-plugin"); // 文件夹清除工具
let merge = require("webpack-merge");

let baseWebpackConfig = require("./webpack.base.config.js");
let {config, entries} = require("./config.js");
let {production} = config;

let webpackPropConfig = merge(baseWebpackConfig, {
    output: {
        path: path.join(__dirname, production.dir), //打包后生成的目录
        filename: "static/js/[name].[hash:6].js",	//根据对应入口名称，生成对应js名称
        chunkFilename: "static/js/[id].chunk.js"
    },
    module: {
        loaders: [
            {
                test: /\.(htm|html)$/i,
                loader: "html-withimg-loader?min=true"
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
                options: {
                    name: "static/fonts/[name].[hash:6].[ext]",  //输出目录以及名称
                    publicPath: "../../"
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                loader: "url-loader",
                exclude: /img/,
                options: {
                    limit: 30720, //30720 30kb 图片转base64。设置图片大小，小于此数则转换。
                    name: "static/images/[name].[hash:6].[ext]", //输出目录以及名称
                    publicPath: "../../"
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                loader: "url-loader",
                exclude: /images/,
                options: {
                    limit: 30720, //30720 30kb 图片转base64。设置图片大小，小于此数则转换。
                    name: "static/img/[name].[hash:6].[ext]", //输出目录以及名称
                    publicPath: "./"
                }
            }
        ]
    },
    // 在配置中添加插件
    plugins: [
        new CleanPlugin([production.dir]),// 清空目录文件夹
        new ExtractTextPlugin("static/css/[name].[hash:6].css"), //提取CSS行内样式，转化为link引入
        new webpack.NoEmitOnErrorsPlugin()
    ]
});

for(let pro in entries) {
    /*console.log(`key: ${pro}, value: ${entries[pro]}`);*/
    let conf = {
        filename: pro + ".[hash:6].html", //生成的html存放路径，相对于path
        template: entries[pro],
        inject: true, //允许插件修改哪些内容，包括head与body
        hash: false, //是否添加hash值
        chunks: ["common", pro],       
        minify: { //压缩HTML文件
             removeComments: true,//移除HTML中的注释
             collapseWhitespace: true, //删除空白符与换行符
             removeAttributeQuotes: false // 移除属性的引号
        }
    };
    webpackPropConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackPropConfig;