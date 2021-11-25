(function (window) {
    window.__env = window.__env || {};

    // Setting theme
    window.__env.theme = 'stedin';
    // Showing Application
    window.__env.application = true;
    // Show Staking
    window.__env.staking = true;

    window.__env.rpcUrl = 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/';
    window.__env.chainId = 73799;
    window.__env.cacheServerUrl = 'https://identitycache-dev.energyweb.org/v1';
    window.__env.natsServerUrl = 'https://identityevents-dev.energyweb.org/';
    window.__env.kmsServerUrl = undefined;
    window.__env.stakingPoolFactoryAddress = '0x3490B3e5E7C1f696c61FDe1c2679725B19274B0e';

}(this));
