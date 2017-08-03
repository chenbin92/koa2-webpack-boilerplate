/* eslint no-console: 0 */
import Koa from 'koa';
import path from 'path';
import render from 'koa-ejs';
import serve from 'koa-static';
import assetsMiddleware from './middleware/assetsMiddleware';
import router from './router';
import { chalkInfo } from '../build/chalkConfig';

const port = process.env.HTTP_PORT || 3000;
const ip = process.env.HTTP_IP || undefined;
const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout/index',
  viewExt: 'html',
  cache: false,
});

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const devMiddleware = require('./middleware/devMiddleware');
  const webpackConfig = require('../build/webpack.config');
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
  }));
}

if (process.env.NODE_ENV === 'production') {
  console.log(`============= current env is ${process.env.NODE_ENV} =========================`);
  app.use(serve(path.resolve(__dirname, './public/')));
}

app.use(assetsMiddleware({
  manifestPath: path.join(__dirname, 'public', 'assets_map.json'),
}));

app.use(router().routes()).use(router().allowedMethods());

// app.use(hotMiddleware(compiler));

app.listen(port, ip, () => {
  console.log(chalkInfo(`============= [app started at http://${ip ? ip : 'localhost'}:${port}]============= `));
});
