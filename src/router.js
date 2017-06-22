import Router from 'koa-router';
import home from './controller/home'

const appRoutes = (app) => {
  const router = new Router();

  router
    .get('/home', home);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return router;
}

export default appRoutes;

