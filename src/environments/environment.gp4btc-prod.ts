import { constants } from './constants';
import { ChainId } from '../app/core/config/chain-id';

export const environment = {
  production: true,
  theme: 'default',
  application: true,

  rpcUrl: 'https://rpc.energyweb.org/',
  chainId: ChainId.EWC,
  cacheServerUrl: 'https://identitycache-gp4btc-prod.energyweb.org/v1',
  natsServerUrl: 'https://identityevents-gp4btc-prod.energyweb.org/',
  ekcUrl: 'https://azure-proxy-server.energyweb.org/api/v1',
  showAzureLoginOption: false,
  natsEnvironmentName: 'ewf-gp4btc-prod',
  rootNamespace: 'auth.ewc',

  fullNetworkName: 'Energy Web Chain',
  networkName: 'EWC',
  currencyName: 'EWT',
  currencySymbol: 'EWT',
  blockExplorerUrl: 'https://explorer.energyweb.org',
  SENTRY_ENVIRONMENT: 'gp4btc-prod',
  idleTime: 900,
  idleTimeout: 300,
  orgRequestEmail: '',
  ...constants,
};
