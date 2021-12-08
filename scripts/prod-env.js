const fs = require('fs');
const envConfig = 'dist/env.js';

fs.readFile(envConfig, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data
        .replace('cacheServerUrl = \'https://identitycache-dev.energyweb.org/v1\'', 'cacheServerUrl = \'https://volta-identitycache.energyweb.org/v1\'')
        .replace('natsServerUrl = \'https://identityevents-dev.energyweb.org/\'', 'natsServerUrl = \'https://volta-identityevents.energyweb.org/\'')
        .replace('kmsServerUrl = undefined', 'kmsServerUrl = \'https://kms.energyweb.org/connect/new\'')
        .replace('natsEnvironmentName = \'ewf-dev\'', 'natsEnvironmentName = \'ewf-prod\'')

    fs.writeFile(envConfig, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
