import { ENSPrefixes } from '../../../routes/applications/new-role/new-role.component';

export class DomainUtils {
  /**
   * Returns string in format without roles. It might be application.apps.org.iam.ewc or org.iam.ewc
   * @param domain
   */
  static getParentNamespace(domain: string): string {
    return domain.split(`.${ENSPrefixes.Roles}.`).pop();
  }

  /**
   * Returns string in format roles.**organization-namespace**
   * @param domain
   */
  static getRoleNamespace(domain: string): string {
    return `${ENSPrefixes.Roles}.${domain
      .split(`.${ENSPrefixes.Roles}.`)
      .pop()}`;
  }

  static getRoleNameFromDomain(domain: string): string {
    return domain.split(`.${ENSPrefixes.Roles}.`).shift();
  }

  static addRoleNameToNamespace(roleName: string, namespace: string): string {
    return `${roleName}.${ENSPrefixes.Roles}.${namespace}`;
  }
}
