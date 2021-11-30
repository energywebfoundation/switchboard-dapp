export class EnvService {

  theme = 'default';
  application = true;
  staking = true;

  rpcUrl = 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/';
  chainId = 73799;

  cacheServerUrl = 'https://identitycache-dev.energyweb.org/v1';
  natsServerUrl = 'https://identityevents-dev.energyweb.org/';
  kmsServerUrl = undefined;
  stakingPoolFactoryAddress = undefined;
  showAzureLoginOption = true;
}
