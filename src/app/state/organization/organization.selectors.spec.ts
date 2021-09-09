import { getLastHierarchyOrg } from './organization.selectors';

describe('Organization Selectors', () => {
  describe('getLastHierarchyOrg', () => {
    it('should return undefined when list is empty', () => {
      expect(getLastHierarchyOrg.projector([])).toEqual(undefined);
    });

    it('should return last element from the list', () => {
      expect(getLastHierarchyOrg.projector([1, 2, 3])).toEqual(3 as any);
    });
  });
});
