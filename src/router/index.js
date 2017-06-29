import Router from 'koa-router';
import home from '../controller/home';
import about from '../controller/about';

const appRoutes = app => {
  // TODO: 添加前缀会导致静态资源无法加载
  const router = new Router({
    // prefix: '/test'
  });

  router
    .get('/home', home)
    .get('/about', about);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return router;
};

export default appRoutes;

