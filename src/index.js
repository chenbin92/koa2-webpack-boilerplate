import Koa from 'koa';
import path from 'path';
import render from 'koa-ejs'
import appRoutes from './router';

const port = process.env.HTTP_PORT || 3001;
const ip = process.env.HTTP_IP || undefined;
const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: true
})

appRoutes(app);

app.listen(port, ip, () => {
  console.log(`app started at http://${ip ? ip : 'localhost'}:${port}`);
});
