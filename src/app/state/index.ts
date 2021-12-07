// === Assets ===
import * as AssetDetailsActions from './assets/details/asset-details.actions';
import * as AssetDetailsSelectors from './assets/details/asset-details.selectors';

import * as OwnedAssetsActions from './assets/owned/owned.actions';
import * as OwnedAssetsSelectors from './assets/owned/owned.selectors';

// === Auth ===
import * as AuthActions from './auth/auth.actions';
import * as AuthSelectors from './auth/auth.selectors';

// === Stake ===
import * as StakeActions from './stake/stake.actions';
import * as StakeSelectors from './stake/stake.selectors';

// === User Claim ===
import * as UserClaimActions from './user-claim/user.actions';
import * as UserClaimSelectors from './user-claim/user.selectors';

// === Organization ===
import * as OrganizationActions from './governance/organization/organization.actions';
import * as OrganizationSelectors from './governance/organization/organization.selectors';

// === Layout ===
import * as LayoutActions from './layout/layout.actions';
import * as LayoutSelectors from './layout/layout.selectors';

// === Application ===
import * as ApplicationActions from './governance/application/application.actions';
import * as ApplicationSelectors from './governance/application/application.selectors';

// === Role ===
import * as RoleActions from './governance/role/role.actions';
import * as RoleSelectors from './governance/role/role.selectors';

// === Settings ===
import * as SettingsActions from './settings/settings.actions';
import * as SettingsSelectors from './settings/settings.selectors';

export * from './store-root.module';
export {
  AssetDetailsActions,
  AssetDetailsSelectors,
  OwnedAssetsActions,
  OwnedAssetsSelectors,

  AuthActions,
  AuthSelectors,

  StakeActions,
  StakeSelectors,

  UserClaimActions,
  UserClaimSelectors,

  OrganizationActions,
  OrganizationSelectors,
  ApplicationActions,
  ApplicationSelectors,
  RoleActions,
  RoleSelectors,

  LayoutActions,
  LayoutSelectors,

  SettingsActions,
  SettingsSelectors
};
