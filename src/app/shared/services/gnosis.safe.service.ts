import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk';

const opts = {
  // whitelistedDomains: [/*/volta\\.gnosis-safe\\.io/*/],
};

export const safeAppSdk = new SafeAppsSDK(opts);
