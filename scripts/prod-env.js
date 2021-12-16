const fs = require('fs');
const envConfig = 'dist/env.js';

fs.readFile(envConfig, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data
        .replace('chainId = 73799', 'chainId = 246')
        .replace('rpcUrl = \'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/\'', 'rpcUrl = \'https://rpc.energyweb.org/\'')
        .replace('cacheServerUrl = \'https://identitycache-dev.energyweb.org/v1\'', 'cacheServerUrl = \'https://identitycache.energyweb.org/v1\'')
        .replace('natsServerUrl = \'https://identityevents-dev.energyweb.org/\'', 'natsServerUrl = \'https://identityevents.energyweb.org/\'')
        .replace('kmsServerUrl = undefined', 'kmsServerUrl = \'https://kms.energyweb.org/connect/new\'')
        .replace('natsEnvironmentName = \'ewf-dev\'', 'natsEnvironmentName = \'ewf-prod\'')
        .replace('rootNamespace = \'iam.ewc\'', 'rootNamespace = \'auth.ewc\'')
        .replace('showAzureLoginOption = true', 'showAzureLoginOption = false')
        .replace('window.__env.claimManagerAddress = \'0xC3dD7ED75779b33F5Cfb709E0aB02b71fbFA3210\'', 'window.__env.claimManagerAddress = \'0x23b026631A6f265d17CFee8aa6ced1B244f3920C\'');

    fs.writeFile(envConfig, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
