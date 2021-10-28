const fs = require('fs');
const f = 'dist/env.js';

fs.readFile(f, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var result = data.replace(/theme = 'default'/g, 'theme = \'stedin\'');
    fs.writeFile(f, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
