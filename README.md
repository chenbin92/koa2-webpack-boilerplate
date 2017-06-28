## 问题：

一个域名下面部署多个项目，如何动态的给每个项目添加唯一标识，然后通过nginx 配置代理到IP ＋Port 实现一个域名下部署
    多个项目？

## 需求：

  1. router：路由添加prefix
  2. public：静态资源添加prefix
  3. scripts：
  4. stylesheets：
  5. link：


## 任务
  1. 区分 prod， dev， test
  2. extract css
  3. assets proxy
  4. hot reload
  5. Eslint
  6. pre-commit

## 问题
  改动文件编译后相应的文件会递增

## 参考
  * http://www.cnblogs.com/lvdabao/p/5944420.html

  hot reload:
  * https://github.com/glenjamin/webpack-hot-middleware
  * https://github.com/webpack/webpack-dev-middleware
  * http://nekomiao.me/2017/05/24/koa2-react-hotmidllware/
  * https://github.com/leecade/koa-webpack-middleware
  * https://gmiam.com/post/webpack-hot-replacement.html
  * https://github.com/leecade/koa-webpack-middleware
  * http://hubcarl.github.io/blog/2017/04/15/egg-webpack/

  webpack-bundle-analyzer
  * https://zhuanlan.zhihu.com/p/26710831
