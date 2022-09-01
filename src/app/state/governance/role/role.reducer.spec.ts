import * as fromReducer from './role.reducer';
import * as RoleActions from './role.actions';
import { IRole, NamespaceType } from 'iam-client-lib';

describe('Role reducer', () => {
  describe('getListSuccess action', () => {
    it('should set list in a immutable way', () => {
      const { initialState } = fromReducer;
      const list = [{ namespace: 'test' } as IRole] as IRole[];
      const action = RoleActions.getListSuccess({ list, namespace: 'iam.ewc' });
      const state = fromReducer.reducer(initialState, action);

      expect(state.list).toEqual(list);
      expect(state.list).not.toBe(
        list,
        'state.list have the same reference as list'
      );
    });
  });
});
