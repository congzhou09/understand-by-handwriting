const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./config");

function resolve(dir) {
  return path.join(__dirname, "..", dir); //__dirname是当前文件所在目录
}

module.exports = {
  context: resolve("."),
  entry: {
    app: "./src/main.js",
  },
  output: {
    publicPath: baseConfig.urlPrefix,
    path: resolve("dist"),
    filename: "static/js/[name]-[hash].js",
  },
  optimization: {
    runtimeChunk: "single", //将webpack的runtime单独提取到一个chunk，且被多个入口共用
    splitChunks: {
      cacheGroups: {
        vendor: {
          //单独提取到vendor中的库
          test: /[\\/]node_modules[\\/](jquery)[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: 2, //某个module同时符合多个Group的条件的时候移入priority值更大的chunk中
        },
        common: {
          //其他node_modules文件夹里的库提取到common中
          test: /[\\/]node_modules[\\/]/,
          name: "common",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolve("src")],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: resolve("babel-cache"),
            cacheCompression: false
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-preset-env")({
                  browsers: "last 2 versions",
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/img/[name].[hash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/fonts/[name].[hash:7].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: "body",
    }),
    //webpack-dev-server在内存中虚拟一套目录，也需要用到CopyWebpackPlugin，否则当publicPath非默认值时会导致某些static下的资源在dev模式下访问不到
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: path.resolve(__dirname, "../dist/static"),
        ignore: [".*"],
      },
    ]),
  ],
};
