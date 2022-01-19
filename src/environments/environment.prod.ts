import { constants } from './constants';

export const environment = {
  production: true,
  theme: 'default',
  application: true,

  rpcUrl: 'https://rpc.energyweb.org/',
  chainId: 246,
  cacheServerUrl: 'https://identitycache.energyweb.org/v1',
  natsServerUrl: 'https://identityevents.energyweb.org/',
  kmsServerUrl: 'https://kms.energyweb.org/connect/new',
  claimManagerAddress: '0x23b026631A6f265d17CFee8aa6ced1B244f3920C',
  showAzureLoginOption: false,
  natsEnvironmentName: 'ewf-prod',
  rootNamespace: 'auth.ewc',

  fullNetworkName: 'Energy Web Chain',
  networkName: 'EWC',
  currencyName: 'EWT',
  currencySymbol: 'EWT',
  blockExplorerUrl: 'https://explorer.energyweb.org',
  SENTRY_ENVIRONMENT: 'production',
  ...constants,
};
