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
let {dev} = config;

let webpackDevConfig = merge(baseWebpackConfig, {
    output: {
        path: path.join(__dirname, dev.dir), //打包后生成的目录
        //publicPath: "./",
        filename: "static/js/[name].js"	//根据对应入口名称，生成对应js名称
    },
    module: {
        loaders: [
            {
                test: /\.(htm|html)$/i,
                loader: "html-withimg-loader?min=false"
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
                options: {
                    name: "static/fonts/[name].[ext]",
                    publicPath: "../../"
                }
            },
            // css中图片路径
            {
                test: /\.(png|jpg|gif)$/i,
                loader: "url-loader",
                exclude: /img/,
                options: {
                    limit: 30720, //30720 30kb 图片转base64。设置图片大小，小于此数则转换。
                    name: "static/images/[name].[ext]",
                    publicPath: "../../"
                }
            },
            //html 图片路径
            {
                test: /\.(png|jpg|gif)$/i,
                loader: "url-loader",
                exclude: /images/,
                options: {
                    limit: 30720, //30720 30kb 图片转base64。设置图片大小，小于此数则转换。
                    name: "static/img/[name].[ext]",
                    publicPath: "./"
                }
            }
        ]
    },
    // 在配置中添加插件
    plugins: [
        new CleanPlugin([dev.dir]),// 清空目录文件夹
        new ExtractTextPlugin("static/css/[name].css"), //提取CSS行内样式，转化为link引入
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devServer:{
        contentBase: "./",
        port: dev.port,
		historyApiFallback: true,
        inline: true,
        hot: false
    }
});

for (let pro in entries) {
    /*console.log(`key: ${pro}, value: ${entries[pro]}`);*/
    let conf = {
        filename: pro + ".html", //生成的html存放路径，相对于path
        template: entries[pro],
        inject: true, //允许插件修改哪些内容，包括head与body
        hash: false, //是否添加hash值
        chunks: ["common", pro],
        minify: false
    };
    webpackDevConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackDevConfig;