import { Action } from '@ngrx/store';
import { initialState, reducer } from './user.reducer';

describe('User Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {};

      const result = reducer(initialState, action as Action);

      expect(result).toBe(initialState);
    });
  });
});
