const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    plugins: [
        new NodePolyfillPlugin({
            excludeAliases: [
                "Buffer",
                "console",
                "process",
                "assert",
                "buffer",
                "console",
                "constants",
                "domain",
                "events",
                "path",
                "punycode",
                "process",
                "querystring",
                "_stream_duplex",
                "_stream_passthrough",
                "_stream_readable",
                "_stream_transform",
                "_stream_writable",
                "string_decoder",
                "sys", "timers", "tty", "url", "util", "vm", "zlib"
            ]
        })
    ]
}
