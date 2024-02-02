const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'distr'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    sourceMap: true
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }
        ]
      },
      {
        test: /\.(png|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: (name) => {
            const path = name.filename.split('/').slice(1, -1).join('/');
            return `${path}/[name][ext]`
          }
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    compress: true,
    open: true,
    port: 8080,
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/img", to: "img" }
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/mock", to: "mock" }
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/sound", to: "sound" }
      ],
    }),
  ]
};