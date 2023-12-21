const { composePlugins, withNx } = require('@nx/webpack');
const Dotenv = require('dotenv-webpack');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.plugins.push(new Dotenv())
    return config;
  }
);
