import { UserEntity } from './user-claim.models';
import * as UserActions from './user.actions';
import { State, initialState, reducer } from './user.reducer';

describe('User Reducer', () => {

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
