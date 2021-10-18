/**
 *  This file is for patching import for nats.ws
 *  With Angular 12 current import inside iam-client-lib is making an error while building application.
 *  This patch fixes import before building application.
 */

const fs = require('fs');
const file = 'node_modules/iam-client-lib/dist/iam-client-lib.esm.js';

fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace('nats.ws/lib/src/mod.js', 'nats.ws');

  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
