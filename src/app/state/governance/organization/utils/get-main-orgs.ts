/* eslint-disable @typescript-eslint/no-explicit-any */
export const getMainOrgs = ($getOrgList: any[]) => {
  const list = [];
  const subList = [];

  // Separate Parent & Child Orgs
  $getOrgList.forEach((item: any) => {
    const namespaceArr = item.namespace.split('.');
    if (namespaceArr.length === 3) {
      list.push(item);
    } else {
      if (!subList[namespaceArr.length - 4]) {
        subList[namespaceArr.length - 4] = [];
      }
      subList[namespaceArr.length - 4].push(item);
    }
  });

  // Remove Unnecessary Sub-Orgs from Main List
  if (list.length || subList.length) {
    for (let i = 0; i < subList.length; i++) {
      const arr = subList[i];
      if (arr && arr.length) {
        for (const subOrg of arr) {
          let exists = false;
          for (const mainOrg of list) {
            if (
              subOrg.namespace &&
              subOrg.namespace.includes(mainOrg.namespace)
            ) {
              exists = true;
              break;
            }
          }
          if (!exists) {
            list.push(subOrg);
          }
        }
      }
    }
  }

  return list;
};
