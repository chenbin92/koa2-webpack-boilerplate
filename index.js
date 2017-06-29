require('babel-register')({
  ignore: /node_modules\/(?!koa-*)(?!koa2-boilerplate)/,
});
require('./src/index.js');
