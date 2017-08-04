const fs = require('fs');
const assert = require('assert');

module.exports = (options = {}) => {

  options.outPath = options.outPath || '';
  options.env = options.env || 'development';

  const assetsMiddleware = async (ctx, next) => {

    const getUrlByEnv = assetName => {
      assert(typeof assetName === 'string', 'assetName required, and must be a string');
      assert(assetName.split.length > 1, 'assetName should be similar to application.css or application.js');

      const name = assetName.split('.')[0];
      const suffix = assetName.split('.')[1];

      let url = '';

      if (options.env === 'development') {
        url = `${options.outPath}/${name}.${suffix}`;
        return url;
      }

      if (options.env === 'production') {
        let manifest = {};

        try {
          const content = fs.readFileSync(options.manifestPath, 'utf8');
          manifest = JSON.parse(content);
        } catch (e) {
          throw new Error(`can't manifest file from ${options.manifestPath}`);
        }
        url = manifest[name][suffix];
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
