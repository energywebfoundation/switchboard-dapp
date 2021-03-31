import { constants } from './constants';

export const environment = {
  production: false,  
  cacheServerUrl: 'https://identitycache-dev.energyweb.org/',
  natsServerUrl: 'https://identityevents-dev.energyweb.org/',
  kmsServerUrl: undefined,
  walletConnectOptions: {
    // rpcUrl: 'https://volta-rpc.energyweb.org/',
    // rpcUrl: 'https://volta-internal-archive.energyweb.org/',
    rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
    chainId: 73799
  },
  ...constants  
};
