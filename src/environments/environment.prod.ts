import { constants } from './constants';
import { ChainId } from '../app/core/config/chain-id';

export const environment = {
  production: true,
  theme: 'default',
  application: true,

  rpcUrl: 'https://rpc.energyweb.org/',
  chainId: ChainId.Volta,
  cacheServerUrl: 'https://identitycache.energyweb.org/v1',
  natsServerUrl: 'https://identityevents.energyweb.org/',
  ekcUrl: 'https://azure-proxy-server.energyweb.org/api/v1',
  showAzureLoginOption: false,
  natsEnvironmentName: 'ewf-prod',
  rootNamespace: 'auth.ewc',

  fullNetworkName: 'Energy Web Chain',
  networkName: 'EWC',
  currencyName: 'EWT',
  currencySymbol: 'EWT',
  blockExplorerUrl: 'https://explorer.energyweb.org',
  SENTRY_ENVIRONMENT: 'production',
  INFURA_PROJECT_ID: '2DD5GcJRpMeuqMoKsgT95AQ8OI3',
  INFURA_PROJECT_SECRET: '842995992aa1edd763196b30d727a45d',
  ...constants,
};
