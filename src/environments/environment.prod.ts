import { constants } from './constants';

export const environment = {
  production: true,  
  cacheServerUrl: 'http://13.52.78.249:3333/',
  natsServerUrl: 'http://13.52.78.249:9222',
  walletConnectOptions: {
    rpcUrl: 'https://volta-rpc.energyweb.org/',
    chainId: 73799
  },
  ...constants
};
