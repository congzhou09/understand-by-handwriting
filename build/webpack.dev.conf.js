const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseConfig = require('./config');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: "eval-source-map",
    devServer: {
        port: 2021,
        index: 'index.html',
        // historyApiFallback: {
        //     index: baseConfig.urlPrefix
        // },
        publicPath: baseConfig.urlPrefix,
        // proxy: {
        //     '/onepath/*': {
        //         target: 'http://0.0.0.0:2018/',
        //         pathRewrite: {'^/onepath': ''},
        //     }
        // }
    },
    plugins: [
        new MiniCssExtractPlugin({
            path: path.join(__dirname, "../dist"),
            filename: 'static/css/[name]-[hash].css'
        })
    ]
});

module.exports = webpackConfig;