const Koa = require('koa');
const webpack = require('webpack');
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
const { chalkInfo } = require('./chalkConfig');
const webpackConfig = require('./webpack.config');

const app = new Koa();
const port = process.env.HTTP_PORT || 4000;
const ip = process.env.HTTP_IP || undefined;
const compiler = webpack(webpackConfig);
const options = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
  reload: true,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
  },
};

app.use(devMiddleware(compiler, options));
app.use(hotMiddleware(compiler));

app.listen(port, ip, () => {
  console.log(chalkInfo(`============= [assets watch at http://${ip ? ip : 'localhost'}:${port}]============= `));
});
