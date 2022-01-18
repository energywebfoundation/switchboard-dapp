const fs = require('fs');
const envConfig = 'dist/env.js';

fs.readFile(envConfig, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data.replace(/theme = 'default'/g, 'theme = \'stedin\'')
        .replace(/application = true/g, 'application = false')
        .replace(/staking = true/g, 'staking = false');

    fs.writeFile(envConfig, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});

const indexHTML = 'dist/index.html'
fs.readFile(indexHTML, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data.replace('<title>Switchboard</title>', '<title>Stedin</title>')

    fs.writeFile(indexHTML, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
