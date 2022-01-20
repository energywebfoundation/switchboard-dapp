import { OrganizationProvider } from '../models/organization-provider.interface';

export const getOrgHierarchy = (
  hierarchy: OrganizationProvider[],
  org: OrganizationProvider
) => {
  if (!org) {
    return hierarchy;
  }
  const index = hierarchy.findIndex(
    (item) => item?.namespace === org?.namespace
  );
  const orgHierarchy = [...hierarchy];
  if (index >= 0) {
    orgHierarchy.splice(index);
  }

  return [...orgHierarchy, org];
};
