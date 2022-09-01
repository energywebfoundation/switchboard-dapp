import * as fromReducer from './application.reducer';
import * as ApplicationActions from './application.actions';
import { IApp } from 'iam-client-lib';

describe('Application reducer', () => {
  describe('getListSuccess action', () => {
    it('should set list in a immutable way', () => {
      const { initialState } = fromReducer;
      const list = [{ namespace: 'test' } as IApp] as IApp[];
      const action = ApplicationActions.getListSuccess({
        list,
        namespace: 'iam.ewc',
      });
      const state = fromReducer.reducer(initialState, action);

      expect(state.list).toEqual(list);
      expect(state.list).not.toBe(
        list,
        'state.list have the same reference as list'
      );
    });
  });
});
