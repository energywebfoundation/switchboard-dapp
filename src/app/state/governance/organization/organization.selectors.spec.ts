import {
  getHierarchyLength,
  getLastHierarchyOrg,
} from './organization.selectors';

describe('Organization Selectors', () => {
  describe('getLastHierarchyOrg', () => {
    it('should return undefined when list is empty', () => {
      expect(getLastHierarchyOrg.projector([])).toEqual(undefined);
    });

    it('should return last element from the list', () => {
      expect(getLastHierarchyOrg.projector([1, 2, 3])).toEqual(3 as any);
    });
  });

  describe('getHierarchyLength', () => {
    it('should return length of empty array', () => {
      expect(getHierarchyLength.projector([])).toEqual(0);
    });
  });
});
