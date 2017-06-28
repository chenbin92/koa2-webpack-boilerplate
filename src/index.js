import Koa from 'koa';
import path from 'path';
import render from 'koa-ejs';
import serve from 'koa-static';
import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import webpackConfig from '../build/webpack.config';
import appRoutes from './router';

const compiler = webpack(webpackConfig);

const port = process.env.HTTP_PORT || 3000;
const ip = process.env.HTTP_IP || undefined;
const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout/index',
  viewExt: 'html',
  cache: false,
  debug: true,
});

const wdm = devMiddleware(compiler, {
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
  reload: true,
  publicPath: './', // config.output.publicPath
  stats: {
    colors: true,
  },
});

app.use(wdm);
app.use(hotMiddleware(compiler));


// app.use(function* (next) {
//   yield require("webpack-hot-middleware")(compiler).bind(null, this.req, this.res);
//   yield next;
// });;


app.use(serve(path.resolve(__dirname, './public')));

appRoutes(app);

app.listen(port, ip, () => {
  console.log(`app started at http://${ip ? ip : 'localhost'}:${port}`);
});
