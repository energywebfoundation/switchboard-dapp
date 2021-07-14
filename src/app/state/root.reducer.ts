import * as userClaim from './user-claim/user.reducer';
import * as stake from './stake/stake.reducer';

export const rootReducer = {
  [userClaim.USER_FEATURE_KEY]: userClaim.reducer,
  [stake.USER_FEATURE_KEY]: stake.reducer
};
