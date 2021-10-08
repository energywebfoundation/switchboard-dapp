import { constants } from './constants';

export const environment = {
  production: true,
  cacheServerUrl: 'https://volta-identitycache.energyweb.org/v1',
  natsServerUrl: 'https://volta-identityevents.energyweb.org/',
  kmsServerUrl: 'https://kms.energyweb.org/connect/new',
  walletConnectOptions: {
    // rpcUrl: 'https://volta-rpc.energyweb.org/',
    // rpcUrl: 'https://volta-internal-archive.energyweb.org/',
    rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
    chainId: 73799
  },
  featureVisible: false,
  ...constants
};
