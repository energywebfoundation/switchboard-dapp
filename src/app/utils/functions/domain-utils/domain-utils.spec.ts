import { DomainUtils } from '@utils';

describe('DomainUtils', () => {
  it('should get parent namespace from domain', () => {
    const namespace = 'org.iam.ewc';
    expect(
      DomainUtils.getParentNamespace(
        DomainUtils.addRoleNameToNamespace('rolename', namespace)
      )
    ).toEqual(namespace);
  });

  it('should get rolename from domain', () => {
    const rolename = 'rolename';
    expect(
      DomainUtils.getRoleNameFromDomain(
        DomainUtils.addRoleNameToNamespace(rolename, 'org.iam.ewc')
      )
    ).toEqual(rolename);
  });
});
