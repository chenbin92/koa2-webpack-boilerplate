const path = require('path');

// ========================================================
// Default Configuration
// ========================================================
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_src: 'src',
  dir_public: 'public',
  dir_relase: 'relase',
  dir_test: 'tests',

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_hash_type: 'hash',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: 'localhost',
  server_ip: process.env.HTTP_IP || '127.0.0.1',
  server_port: process.env.HTTP_PORT || 3000,
};

// ========================================================
// Environment Configuration
// ========================================================
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
};

// ----------------------------------
// The Development Compiler Configuration
// ----------------------------------
config.development = {
  compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
  compiler_devtool: 'cheap-module-eval-source-map',
};

// ----------------------------------
// The Prodution Compiler Configuration
// ----------------------------------
config.production = {
  compiler_public_path: '/',
  compiler_fail_on_warning: false,
  compiler_devtool: 'source-map',
  compiler_stats: {
    chunks: true,
    chunkModules: true,
    colors: true,
  },
};

// ------------------------------------
// Utilities
// ------------------------------------
function base() {
  const args = [ config.path_base ].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
}

config.paths = {
  base: base,
  src: base.bind(null, config.dir_src),
  public: base.bind(null, config.dir_public),
  relase: base.bind(null, config.dir_resale),
  test: base.bind(null, config.dir_test),
};

module.exports = config;
