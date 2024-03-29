const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const sentryPlugin = () => {
  if (process.env.SENTRY_AUTH_TOKEN) {
    return [
      new SentryWebpackPlugin({
        org: 'energy-web',
        project: JSON.stringify(process.env.SENTRY_PROJECT_NAME),
        authToken: JSON.stringify(process.env.SENTRY_AUTH_TOKEN),
        include: './dist',
      }),
    ];
  }
  return [];
};
module.exports = {
  devtool: 'source-map',
  plugins: [
    new NodePolyfillPlugin({
      excludeAliases: [
        'console',
        'buffer',
        'console',
        'constants',
        'domain',
        'events',
        'path',
        'punycode',
        'querystring',
        '_stream_duplex',
        '_stream_passthrough',
        '_stream_readable',
        '_stream_transform',
        '_stream_writable',
        'string_decoder',
        'sys',
        'timers',
        'tty',
        'util',
        'vm',
        'zlib',
      ],
    }),
    new webpack.DefinePlugin({
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      INFURA_PROJECT_ID: JSON.stringify(process.env?.INFURA_PROJECT_ID),
      INFURA_PROJECT_SECRET: JSON.stringify(process.env?.INFURA_PROJECT_SECRET),
    }),
    new Dotenv(),
    ...sentryPlugin(),
  ],
};
