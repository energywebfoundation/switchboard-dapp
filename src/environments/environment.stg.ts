import { constants } from './constants';
import { ChainId } from '../app/core/config/chain-id';

export const environment = {
  production: true,
  theme: 'default',
  application: true,

  rpcUrl: 'https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org/',
  chainId: ChainId.Volta,
  cacheServerUrl: 'https://identitycache-staging.energyweb.org/v1',
  natsServerUrl: 'https://identityevents-staging.energyweb.org/',
  ekcUrl: 'https://azure-proxy-server.energyweb.org/api/v1',
  showAzureLoginOption: true,
  natsEnvironmentName: 'ewf-dev',
  rootNamespace: 'iam.ewc',

  fullNetworkName: 'EnergyWeb Volta Chain',
  networkName: 'Volta',
  currencyName: 'Volta Token',
  currencySymbol: 'VT',
  blockExplorerUrl: 'https://volta-explorer.energyweb.org',
  SENTRY_ENVIRONMENT: 'staging',
  idleTime: 900,
  idleTimeout: 300,
  orgRequestEmail: 'iamteam@energyweb.org',
  ...constants,
};
