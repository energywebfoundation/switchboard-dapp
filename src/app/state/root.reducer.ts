import * as userClaim from './user-claim/user.reducer';

export const rootReducer = {
  [userClaim.USER_FEATURE_KEY]: userClaim.reducer
};
