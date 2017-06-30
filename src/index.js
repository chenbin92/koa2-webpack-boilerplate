import Koa from 'koa';
import path from 'path';
import render from 'koa-ejs';
import serve from 'koa-static';
import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import webpackConfig from '../build/webpack.config';
import router from './router';
import { chalkInfo } from '../build/chalkConfig';

const compiler = webpack(webpackConfig);

const port = process.env.HTTP_PORT || 3000;
const ip = process.env.HTTP_IP || undefined;
const app = new Koa();

app.use(serve(path.resolve(__dirname, './public')));
render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout/index',
  viewExt: 'html',
  cache: false,
  debug: process.env.NODE_ENV !== 'production',
});
app.use(router().routes()).use(router().allowedMethods());
app.use(devMiddleware(compiler, {
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
  reload: true,
  publicPath: './', // config.output.publicPath
  stats: {
    colors: true,
  },
}));
app.use(hotMiddleware(compiler));
app.listen(port, ip, () => {
  console.log(chalkInfo(`============= [app started at http://${ip ? ip : 'localhost'}:${port}]============= `));
});
