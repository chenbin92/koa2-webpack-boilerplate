const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT_PATH, 'src/public');
const IMAGES_PATH = path.join(ROOT_PATH, 'src/assets/images');

/**
 * =======================================================
 *  environments
 * =======================================================
 */
const __DEV__ = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';
// const __TEST__ = process.env.NODE_ENV === 'test'
console.log('process.env.NODE_ENV =', process.env.NODE_ENV);

/**
 * =======================================================
 *  plugins
 * =======================================================
 */

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
  _: 'lodash',
});

// TODO: 考虑多页面的情况
const generateHtml = new HtmlWebpackPlugin({
  inject: 'head',
  template: path.join(ROOT_PATH, 'src/view/layout/index_template.html'),
  filename: path.join(ROOT_PATH, 'src/view/layout/index.html'),
});

// TODO: hot reload
// const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
// const noEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();
const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    unused: true,
    dead_code: true,
    warnings: false,
  },
});

const definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('process.env.NODE_ENV'),
});

const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: [ 'common', 'vendor', 'runtime' ],
});

const assetsWebpackPlugin = new AssetsWebpackPlugin({
  filename: 'assets.json',
  path: path.join(ROOT_PATH, 'src', 'config'),
  prettyPrint: true,
  processOutput: function(assets) {
    return 'window.staticMap = ' + JSON.stringify(assets);
  },
});


/**
 * =======================================================
 *  config
 * =======================================================
 */


const config = {
  context: path.join(ROOT_PATH, 'src/assets/javascripts'),

  entry: {
    vendor: './vendor.js',
    common: './commons/index.js',
    application : [ './application.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true' ]
  },

  output: {
    path: OUTPUT_PATH,
    publicPath: './',
    filename: '[name].[hash].js',
  },

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
        loader: 'html-loader',
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
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name],[ext]',
          // publicPath: './t',
          // outputPath: 'images/'
          // prefix: '/test', // not workong
        },
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
    definePlugin,
    commonsChunkPlugin,
    assetsWebpackPlugin,
  ],

  // 设置性能预设值(https://webpack.js.org/configuration/performance)
  // object { assetFilter?, hints?, maxEntrypointSize?, maxAssetSize? }
  performance: __PROD__ && {
    maxAssetSize: 100,
    maxEntrypointSize: 300,
    hints: 'warning',
  },
};

/**
 * =======================================================
 * TODO: __DEV__
 * =======================================================
 */
if (__DEV__) {
  config.devtool = 'cheap-module-eval-source-map';
  console.log('Enabling plugins for live development (HMR, NoErrors).');
  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:3000' })
  );
}

/**
 * =======================================================
 *  __PROD__
 * =======================================================
 */

if (__PROD__) {
  config.devtool = 'source-map';
  console.log('Enabling plugins for production (OccurenceOrder, UglifyJS).');
  config.plugins.push(
    uglifyJsPlugin,
    occurrenceOrderPlugin
  );
}

module.exports = config;
