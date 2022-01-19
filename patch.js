/**
 *  This file is for patching import for nats.ws
 *  With Angular 12 current import inside iam-client-lib is making an error while building application.
 *  This patch fixes import before building application.
 */

// eslint-disable-next-line
const fs = require('fs');
const file = 'node_modules/nats.ws/package.json';

fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace('"exports": {\n' +
      '    ".": {\n' +
      '      "require": "./nats.cjs",\n' +
      '      "default": "./nats.js"\n' +
      '    }\n' +
      '  },', '');

  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
