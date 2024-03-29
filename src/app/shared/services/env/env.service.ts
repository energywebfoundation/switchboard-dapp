import { environment } from '../../../../environments/environment';

export class EnvService {
  theme = environment.theme;
  application = environment.application;

  rpcUrl = environment.rpcUrl;
  chainId = environment.chainId;

  cacheServerUrl = environment.cacheServerUrl;
  natsServerUrl = environment.natsServerUrl;
  ekcUrl = environment.ekcUrl;
  showAzureLoginOption: boolean = environment.showAzureLoginOption;
  natsEnvironmentName: string = environment.natsEnvironmentName;
  rootNamespace: string = environment.rootNamespace;
  production: boolean = environment.production;
  networkName: string = environment.networkName;
  fullNetworkName: string = environment.fullNetworkName;
  currencyName: string = environment.currencyName;
  currencySymbol: string = environment.currencySymbol;
  blockExplorerUrl: string = environment.blockExplorerUrl;
  SENTRY_ENVIRONMENT: string = environment.SENTRY_ENVIRONMENT;
  INFURA_PROJECT_ID: string =
    INFURA_PROJECT_ID ?? process?.env?.INFURA_PROJECT_ID;
  INFURA_PROJECT_SECRET: string =
    INFURA_PROJECT_SECRET ?? process?.env?.INFURA_PROJECT_SECRET;
  orgRequestEmail: string = environment.orgRequestEmail;
}
