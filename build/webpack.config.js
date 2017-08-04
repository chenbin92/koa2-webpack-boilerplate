/* eslint no-console: 0 */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
// const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const project = require('./project.config');
const { chalkInfo } = require('./chalkConfig');

const __DEV__ = project.globals.__DEV__;
const __PROD__ = project.globals.__PROD__;
// const __TEST__ = project.globals.__TEST__;

console.log(chalkInfo(`============= [process.env.NODE_ENV = ${process.env.NODE_ENV}] =============`));

const webpackConfig = {
  context: project.paths.src('assets/javascripts'),

  resolve: {
    extensions: [ '.js', '.json' ],
  },

  module: {},
};

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = './application.js';

webpackConfig.entry = {
  vendors: './vendors.js',
  common: './common/index.js',
  application: APP_ENTRY,
  // application: __DEV__ ? [ APP_ENTRY ].concat('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true') : [ APP_ENTRY ],
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  path: project.paths.src('public'),
  publicPath: __PROD__ ? project.production.compiler_public_path : '/',
  filename: __DEV__ ? '[name].js' : `[name].[${project.compiler_hash_type}].js`,
};

// ------------------------------------
// Plugins List
// ------------------------------------
const copyImages = new CopyWebpackPlugin([
  {
    from: project.paths.src('assets/images'),
    to: project.paths.src('public/images'),
  },
]);

const extractSass = new ExtractTextPlugin({
  filename: __DEV__ ? 'application.css' : `[name].[${project.compiler_hash_type}].css`,
  // disable: __DEV__,
});

// fix legacy jQuery plugins which depend on globals
const exposeGlobal = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  _: 'lodash',
});

const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();
const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    unused: true,
    dead_code: true,
    warnings: false,
  },
});

const definePlugin = new webpack.DefinePlugin(project.globals);

const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'runtime',
});

const assetsWebpackPlugin = new AssetsWebpackPlugin({
  filename: 'assets_map.json',
  path: project.paths.src('public'),
  prettyPrint: true,
  // processOutput: function(assets) {
  // return 'window.assetMap = ' + JSON.stringify(assets);
  // },
});

// ------------------------------------
// Apply Plugins
// ------------------------------------
webpackConfig.plugins = [
  copyImages,
  extractSass,
  exposeGlobal,
  definePlugin,
  // TODO: separation vendors.js && common.js
  commonsChunkPlugin,
];

// ------------------------------------
// Development Mode
// ------------------------------------
if (__DEV__) {
  webpackConfig.devtool = project.development.compiler_devtool;
  console.log(chalkInfo('============= [Enabling plugins for live development (HMR, NoErrors)] ============= '));
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
    // new OpenBrowserPlugin({ url: project.development.compiler_public_path })
  );
}

// ------------------------------------
// Production Mode
// ------------------------------------
if (__PROD__) {
  webpackConfig.devtool = project.production.compiler_devtool;
  console.log(chalkInfo('============= [Enabling plugins for production (OccurenceOrder, UglifyJS, commonsChunk)] ============='));
  webpackConfig.plugins.push(
    uglifyJsPlugin,
    occurrenceOrderPlugin,
    assetsWebpackPlugin
    // TODO: shouldn't be here
    // new BundleAnalyzerPlugin()
  );

  // https://webpack.js.org/configuration/performance
  webpackConfig.performance = {
    maxAssetSize: 100,
    maxEntrypointSize: 300,
    hints: 'warning',
  };
}

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.rules = [
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
    },
  },
];

module.exports = webpackConfig;
