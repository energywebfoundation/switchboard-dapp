import { ENSNamespaceTypes } from 'iam-client-lib';

export const filterBy = (data: any[], organization: string, application: string, role: string): any[] => {
  if (organization) {
    data = filterByOrg(data, organization);
  }

  if (application) {
    data = filterByApp(data, application);
  }

  if (role) {
    data = filterByRole(data, role);
  }

  return data;
};

const filterByOrg = (data, organization) => {
  return data.filter((item: any) => {
    let arr = item.namespace.split('.iam.ewc');
    arr = arr[0].split(ENSNamespaceTypes.Roles);
    arr = arr[arr.length - 1].split(ENSNamespaceTypes.Application);

    const org = arr[arr.length - 1];
    return (org.toUpperCase().indexOf(organization.toUpperCase()) >= 0);
  });
};

const filterByApp = (data, application) => {
  return data.filter((item: any) => filterByType(item, application, ENSNamespaceTypes.Application));
};

const filterByRole = (data, role) => {
  return data.filter((item: any) => filterByType(item, role, ENSNamespaceTypes.Roles));
};

const filterByType = (item, filterBy, type: ENSNamespaceTypes) => {
  let arr = item.namespace.split(`.${type}.`);
  arr = arr[0].split('.');
  return (arr[arr.length - 1].toUpperCase().indexOf(filterBy.toUpperCase()) >= 0);
};
