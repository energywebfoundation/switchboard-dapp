import * as userClaim from './user-claim/user.reducer';
import * as auth from './auth/auth.reducer';

export const rootReducer = {
  [userClaim.USER_FEATURE_KEY]: userClaim.reducer,
  [auth.USER_FEATURE_KEY]: auth.reducer,
};
