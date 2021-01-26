import { constants } from './constants';

export const environment = {
  production: true,  
  cacheServerUrl: 'https://volta-iam-cacheserver.energyweb.org/',
  natsServerUrl: 'https://dsb-dev.energyweb.org/',
  walletConnectOptions: {
    // rpcUrl: 'https://volta-rpc.energyweb.org/',
    // rpcUrl: 'https://volta-internal-archive.energyweb.org/',
    rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
    chainId: 73799
  },
  ...constants  
};
