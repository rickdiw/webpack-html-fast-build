/**
 * Created by huangyh(黄永号) on 2017/11/29.
 */

let path = require("path");
let glob = require("glob");
let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");//将你的行内样式提取到单独的css文件里，
let SpritesmithPlugin = require("webpack-spritesmith"); //雪碧图

let {config} = require("./config.js");

let webpackConfig = {
    entry: { //配置入口文件，有几个写几个
        index: "./src/source/index.js",
        list: "./src/source/list.js",
        about: "./src/source/about.js"
    },
    resolve: {
        alias: {
            "@less": path.join(__dirname, "./src/static/less/"),
            "@img": path.join(__dirname, "./src/static/img/")
        },
        //设置require或import的时候可以不需要带后缀
        extensions: [".json", ".js", ".less", ".css", ".png"]
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader"
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader!less-loader"
                })
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["es2015"]
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //全局配置加载
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "common", // 将公共模块提取，生成名为`vendors`的chunk
            minChunks: 3 // 提取至少3个模块共有的部分
        }),

        // 雪碧图
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, "./src/static/images/icons"),
                glob: "*.png"
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, "./src/static/images/sprites/sprite.png"),
                css: path.resolve(__dirname, "./src/static/css/sprites/sprite.css")
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: "../../images/sprites/sprite.png"
            },
            spritesmithOptions: {
                algorithm: "top-down"
            }
        })
    ],
    externals: {
        $: "jQuery"
    }
};

module.exports = webpackConfig;