import { EnvService } from './env.service';

export const EnvServiceFactory = () => {
  const env = new EnvService();

  const getBrowserEnv = () => {
    const browserWindow = window || {};
    return browserWindow['__env'] || {};
  };

  const browserWindowEnv = getBrowserEnv();

  for (const key in browserWindowEnv) {
    if (Object.hasOwnProperty.call(browserWindowEnv, key)) {
      env[key] = window['__env'][key];
    }
  }

  return env;
};

export const EnvServiceProvider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
