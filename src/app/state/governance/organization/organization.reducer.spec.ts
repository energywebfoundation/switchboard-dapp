import * as fromReducer from './organization.reducer';
import * as OrganizationActions from './organization.actions';
import { OrganizationProvider } from './models/organization-provider.interface';

describe('Organization Reducer', () => {
  let list;
  describe('getListSuccess', () => {
    beforeEach(() => {
      list = [
        {
          name: 'testorg',
          namespace: 'testorg.iam.ewc',
          subOrgs: [
            {
              name: 'realsub',
              namespace: 'realsub.testorg.iam.ewc',
            },
            {
              name: 'suborg',
              namespace: 'suborg.testorg.iam.ewc',
            },
          ],
        },
      ] as OrganizationProvider[];
    });
    it('should set list in immutable way', () => {
      const { initialState } = fromReducer;

      const action = OrganizationActions.getListSuccess({ list });
      const state = fromReducer.reducer(initialState, action);

      expect(state.list).toEqual(list);
      expect(state.list).not.toBe(list);
    });

    it('should set history in immutable way', () => {
      const { initialState } = fromReducer;

      const action = OrganizationActions.getListSuccess({ list });
      const state = fromReducer.reducer(initialState, action);

      expect(state.history).toEqual(list);
      expect(state.history).not.toBe(list);
    });
  });
});
