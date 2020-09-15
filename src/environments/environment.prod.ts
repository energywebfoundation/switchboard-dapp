import { constants } from './constants';

export const environment = {
  production: true,  
  walletConnectOptions: {
    rpcUrl: 'https://volta-rpc.energyweb.org/',
    chainId: 73799
  },
  ...constants
};
