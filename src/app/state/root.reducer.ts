import * as userClaim from './user-claim/user.reducer';
import * as stake from './stake/stake.reducer';
import * as pool from './pool/pool.reducer';
import * as auth from './auth/auth.reducer';
import * as assetDetails from './assets/details/asset-details.reducer';

export const rootReducer = {
  [userClaim.USER_FEATURE_KEY]: userClaim.reducer,
  [stake.USER_FEATURE_KEY]: stake.reducer,
  [auth.USER_FEATURE_KEY]: auth.reducer,
  [pool.USER_FEATURE_KEY]: pool.reducer,
  [assetDetails.USER_FEATURE_KEY]: assetDetails.reducer
};
