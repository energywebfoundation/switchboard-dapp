import { environment } from '../../../../environments/environment';

export class EnvService {
  theme = environment.theme;
  application = environment.application;

  rpcUrl = environment.rpcUrl;
  chainId = environment.chainId;

  cacheServerUrl = environment.cacheServerUrl;
  natsServerUrl = environment.natsServerUrl;
  kmsServerUrl = environment.kmsServerUrl;
  claimManagerAddress: string = environment.claimManagerAddress;
  showAzureLoginOption: boolean = environment.showAzureLoginOption;
  natsEnvironmentName: string = environment.natsEnvironmentName;
  rootNamespace: string = environment.rootNamespace;

  networkName: string = environment.networkName;
  fullNetworkName: string = environment.fullNetworkName;
  currencyName: string = environment.currencyName;
  currencySymbol: string = environment.currencySymbol;
  blockExplorerUrl: string = environment.blockExplorerUrl;
  SENTRY_ENVIRONMENT: string = environment.SENTRY_ENVIRONMENT;
}
