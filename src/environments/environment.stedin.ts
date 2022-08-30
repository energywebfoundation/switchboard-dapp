import { constants } from './constants';
import { ChainId } from '../app/core/config/chain-id';

export const environment = {
  production: false,
  theme: 'stedin',
  application: false,

  rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
  chainId: ChainId.Volta,
  cacheServerUrl: 'https://identitycache-dev.energyweb.org/v1',
  natsServerUrl: 'https://identityevents-dev.energyweb.org/',
  ekcUrl: 'https://azure-proxy-server.energyweb.org/api/v1',
  showAzureLoginOption: true,
  natsEnvironmentName: 'ewf-dev',
  rootNamespace: 'iam.ewc',

  fullNetworkName: 'EnergyWeb Volta Chain',
  networkName: 'EnergyWeb Volta Chain',
  currencyName: 'Volta Token',
  currencySymbol: 'VT',
  blockExplorerUrl: 'https://volta-explorer.energyweb.org',
  SENTRY_ENVIRONMENT: 'stedin',
  INFURA_PROJECT_ID: '2DFP01RMyiHTTqymIkPlzwWk7CX',
  INFURA_PROJECT_SECRET: '69b837aa674273d7dfa7cf27f8964bc9',
  idleTime: 900,
  idleTimeout: 300,
  ...constants,
};
