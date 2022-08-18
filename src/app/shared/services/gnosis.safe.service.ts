import SafeAppsSDK, { Opts } from '@gnosis.pm/safe-apps-sdk';

const opts: Opts = {
  allowedDomains: [/gnosis-safe.io/],
};

export const safeAppSdk = new SafeAppsSDK(opts);
