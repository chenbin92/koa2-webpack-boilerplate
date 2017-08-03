const fs = require('fs');
// const path = require('path');
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const defaults = {
  manifestPath: null,
  outPath: 'static',
  cdn: null,
};

module.exports = options => {

  const _options = Object.assign({}, defaults, options);
  try {
    const content = fs.readFileSync(_options.manifestPath, 'utf8');
    global.manifest = JSON.parse(content);
  } catch (e) {
    throw new Error(`can't manifest file from ${_options.manifestPath}`);
  }

  const assetsMiddleware = async (ctx, next) => {

    const getUrl = assetName => {
      const url = global.manifest[assetName].js;
      return url;
    };

    ctx.state.script = (assetName) => {
      return `<script src='${getUrl(assetName)}'></script>`;
    };

    ctx.state.link = (assetName) => {
      return `<link rel='stylesheet' href='${getUrl(assetName)}'>`;
    };

    await next();
  };

  return assetsMiddleware;
};
