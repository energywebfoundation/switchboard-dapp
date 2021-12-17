import { NamespaceType } from 'iam-client-lib';
import { ENSPrefixes } from 'src/app/routes/applications/new-role/new-role.component';

export const filterBy = (data: any[], organization: string, application: string, role: string, namespace: string): any[] => {
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

const filterByOrg = (data, organization, namespace) => {
  return data.filter((item: any) => {
    let arr = item.namespace.split(namespace);
    arr = arr[0].split(ENSPrefixes.Roles);
    arr = arr[arr.length - 1].split(NamespaceType.Application);

    const org = arr[arr.length - 1];
    return (org.toUpperCase().indexOf(organization.toUpperCase()) >= 0);
  });
};

const filterByApp = (data, application) => {
  return data.filter((item: any) => filterByType(item, application, ENSPrefixes.Apps));
};

const filterByRole = (data, role) => {
  return data.filter((item: any) => filterByType(item, role, ENSPrefixes.Roles));
};

const filterByType = (item, filterBy, type: ENSPrefixes) => {
  let arr = item.namespace.split(`.${type}.`);
  arr = arr[0].split('.');
  return (arr[arr.length - 1].toUpperCase().indexOf(filterBy.toUpperCase()) >= 0);
};
