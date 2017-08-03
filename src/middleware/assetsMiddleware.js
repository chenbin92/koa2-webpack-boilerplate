const fs = require('fs');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const defaults = {
  manifestPath: null,
  outPath: 'static',
  env: 'development',
  cdn: null,
};

module.exports = options => {

  const _options = Object.assign({}, defaults, options);

  const assetsMiddleware = async (ctx, next) => {

    const getUrlByEnv = assetName => {
      let url = '';
      if (IS_DEVELOPMENT) {
        url = `/${assetName}.js`;
        return url;
      }

      if (IS_PRODUCTION) {
        let manifest = {};

        try {
          const content = fs.readFileSync(_options.manifestPath, 'utf8');
          manifest = JSON.parse(content);
        } catch (e) {
          throw new Error(`can't manifest file from ${_options.manifestPath}`);
        }

        url = manifest[assetName].js;
        return url;
      }

      return null;
    };

    ctx.state.script = (assetName) => {
      return `<script src='${getUrlByEnv(assetName)}'></script>`;
    };

    ctx.state.link = (assetName) => {
      return `<link rel='stylesheet' href='${getUrlByEnv(assetName)}'>`;
    };

    await next();
  };

  return assetsMiddleware;
};
