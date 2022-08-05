/* eslint-disable @typescript-eslint/no-explicit-any */
import { NamespaceType } from 'iam-client-lib';

export interface FilterByNamespace {
  namespace: string;
}

export const filterBy = (
  data: FilterByNamespace[],
  organization: string,
  application: string,
  role: string,
  namespace: string
): any[] => {
  if (organization) {
    data = filterByOrg(data, organization, namespace);
  }

  if (application) {
    data = filterByApp(data, application);
  }

  if (role) {
    data = filterByRole(data, role);
  }

  return data;
};

const filterByOrg = (
  data: FilterByNamespace[],
  organization: string,
  namespace: string
) => {
  return data.filter((item) => {
    let arr = item.namespace.split(namespace);
    arr = arr[0].split(NamespaceType.Role);
    arr = arr[arr.length - 1].split(NamespaceType.Application);

    const org = arr[arr.length - 1];
    return org.toUpperCase().indexOf(organization.toUpperCase()) >= 0;
  });
};

const filterByApp = (data: FilterByNamespace[], application: string) => {
  return data.filter((item: FilterByNamespace) =>
    filterByType(item, application, NamespaceType.Application)
  );
};

const filterByRole = (data: FilterByNamespace[], role: string) => {
  return data.filter((item: FilterByNamespace) =>
    filterByType(item, role, NamespaceType.Role)
  );
};

const filterByType = (
  item: FilterByNamespace,
  filterBy: string,
  type: NamespaceType
) => {
  let arr = item.namespace.split(`.${type}.`);
  arr = arr[0].split('.');
  return arr[arr.length - 1].toUpperCase().indexOf(filterBy.toUpperCase()) >= 0;
};
