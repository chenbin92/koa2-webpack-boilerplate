/* eslint no-console: 0 */
import Koa from 'koa';
import path from 'path';
import render from 'koa-ejs';
import serve from 'koa-static';
import assetsMiddleware from './middleware/assetsMiddleware';
import router from './router';
import { chalkInfo } from '../build/chalkConfig';

const PORT = process.env.HTTP_PORT || 3000;
const IP = process.env.HTTP_IP || undefined;
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout/index',
  viewExt: 'html',
  cache: false,
});

if (IS_DEV) {
  const webpack = require('webpack');
  const devMiddleware = require('./middleware/devMiddleware');
  const webpackConfig = require('../build/webpack.config');
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
  }));
}

if (IS_PROD) {
  app.use(serve(path.resolve(__dirname, './public/')));
}

app.use(assetsMiddleware({
  env: process.env.NODE_ENV,
  manifestPath: path.join(__dirname, 'public', 'assets_map.json'),
}));

app.use(router().routes()).use(router().allowedMethods());

app.listen(PORT, IP, () => {
  console.log(chalkInfo(`============= [app started at http://${IP ? IP : 'localhost'}:${PORT}]============= `));
});
