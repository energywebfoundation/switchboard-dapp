import * as RoleSelectors from './role.selectors';

describe('Role Selectors', () => {

  describe('isFilterVisible', () => {
    it('should return true if filter is visible', () => {
      expect(RoleSelectors.isFilterVisible.projector({filterVisible: true})).toBeTrue();
    });

    it('should return false if filter is not visible', () => {
      expect(RoleSelectors.isFilterVisible.projector({filterVisible: false})).toBeFalse();
    });
  });

});
