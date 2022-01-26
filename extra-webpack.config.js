const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
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
  ],
};
