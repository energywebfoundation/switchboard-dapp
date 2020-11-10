import { constants } from './constants';

export const environment = {
  production: true,  
  cacheServerUrl: 'https://volta-iam-cacheserver.energyweb.org/',
  natsServerUrl: 'https://dsb-dev.energyweb.org/',
  walletConnectOptions: {
    // rpcUrl: 'https://volta-rpc.energyweb.org/',
    rpcUrl: 'https://volta-internal-archive.energyweb.org/',
    chainId: 73799
  },
  ...constants  
};
