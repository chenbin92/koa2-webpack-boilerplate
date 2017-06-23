const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT_PATH, 'src/public');
const IMAGES_PATH = path.join(ROOT_PATH, 'src/assets/images');

// https://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack
const copyImages = new CopyWebpackPlugin([
  { from: IMAGES_PATH, to: `${OUTPUT_PATH}/images` },
]);

const extractSass = new ExtractTextPlugin({
  filename: 'application.css', // '[name].[contenthash].css'
  disable: process.env.NODE_ENV === 'development',
});

// fix legacy jQuery plugins which depend on globals
const exposeGlobal = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  _: 'lodash'
});

const generateHtml = new HtmlWebpackPlugin({
  inject: 'head',
  template: path.join(ROOT_PATH, 'src/view/layout/index_template.html'),
  filename: path.join(ROOT_PATH, 'src/view/layout/index.html'),
});

const config = {
  context: path.join(ROOT_PATH, 'src/assets/javascripts'),

  entry: './application.js',

  output: {
    path: OUTPUT_PATH,
    publicPath: './',
    filename: '[name].bundle.js',
  },

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|vendor\/assets)/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2',
      },
      {
        test: /\.otf(\?.*)?$/,
        loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]',
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
      },
    ],
  },

  resolve: {
    extensions: [ '.scss', '.js' ],
  },

  plugins: [
    copyImages,
    extractSass,
    generateHtml,
    exposeGlobal,
  ],
};

module.exports = config;
