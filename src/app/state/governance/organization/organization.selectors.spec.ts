import {
  getHierarchyLength,
  getLastHierarchyOrg,
} from './organization.selectors';
import { OrganizationProvider } from './models/organization-provider.interface';

describe('Organization Selectors', () => {
  describe('getLastHierarchyOrg', () => {
    it('should return undefined when list is empty', () => {
      expect(getLastHierarchyOrg.projector([])).toEqual(undefined);
    });

    it('should return last element from the list', () => {
      expect(
        getLastHierarchyOrg.projector([
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ] as OrganizationProvider[])
      ).toEqual({ id: 3 } as any);
    });
  });

  describe('getHierarchyLength', () => {
    it('should return length of empty array', () => {
      expect(getHierarchyLength.projector([])).toEqual(0);
    });
  });
});
