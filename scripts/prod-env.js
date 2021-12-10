const fs = require('fs');
const envConfig = 'dist/env.js';

fs.readFile(envConfig, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data
        .replace('cacheServerUrl = \'https://identitycache-dev.energyweb.org/v1\'', 'cacheServerUrl = \'https://identitycache-staging.energyweb.org//v1\'')
        .replace('natsServerUrl = \'https://identityevents-dev.energyweb.org/\'', 'natsServerUrl = \'wss://identityevents-staging.energyweb.org\'')
        .replace('kmsServerUrl = undefined', 'kmsServerUrl = \'https://kms.energyweb.org/connect/new\'')
        .replace('natsEnvironmentName = \'ewf-dev\'', 'natsEnvironmentName = \'ewf-prod\'')
        .replace('window.__env.claimManagerAddress = \'0xC3dD7ED75779b33F5Cfb709E0aB02b71fbFA3210\'', 'window.__env.claimManagerAddress = \'0x561785174DF7f564f2591bA52B253c0F663427aB\'');

    fs.writeFile(envConfig, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
