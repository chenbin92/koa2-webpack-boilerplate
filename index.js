require('babel-register')({
  ignore: /node_modules\/(?!koa-*)/,
});
require('./src/index.js');
