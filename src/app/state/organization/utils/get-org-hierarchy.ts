import { IOrganization } from 'iam-client-lib';

export const getOrgHierarchy = (hierarchy: IOrganization[], org: IOrganization) => {
  if (!org) {
    return hierarchy;
  }
  const index = hierarchy.findIndex(item => item?.namespace === org?.namespace);
  let orgHierarchy = [...hierarchy];
  if (index >= 0) {
    orgHierarchy.splice(index);
  }

  return [...orgHierarchy, org];
};
