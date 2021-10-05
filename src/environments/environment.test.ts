import { constants } from './constants';

export const environment = {
  production: true,
  cacheServerUrl: 'https://identitycache-dev.energyweb.org/v1',
  natsServerUrl: 'https://identityevents-dev.energyweb.org/',
  kmsServerUrl: undefined,
  walletConnectOptions: {
    // rpcUrl: 'https://volta-rpc.energyweb.org/',
    // rpcUrl: 'https://volta-internal-archive.energyweb.org/',
    rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
    chainId: 73799
  },
  featureVisible: true,
  privateKey: '28571bc941b15e77960c148b8e0c5df05c2cecb43b899b2fb6eaf991f8eade5b',
  ...constants
};
