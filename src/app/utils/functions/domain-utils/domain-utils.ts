import { NamespaceType } from 'iam-client-lib';

// TODO: add more functions and reuse them across application.
export class DomainUtils {
  /**
   * Returns string in format without roles. It might be application.apps.org.iam.ewc or org.iam.ewc
   * @param domain
   */
  static getParentNamespace(domain: string): string {
    return domain?.split(`.${NamespaceType.Role}.`).pop();
  }

  /**
   * Returns string in format roles.**organization-namespace**
   * @param domain
   */
  static getRoleNamespace(domain: string): string {
    return `${NamespaceType.Role}.${domain
      ?.split(`.${NamespaceType.Role}.`)
      ?.pop()}`;
  }

  static getRoleNameFromDomain(domain: string): string {
    return domain?.split(`.${NamespaceType.Role}.`)?.shift();
  }

  static addRoleNameToNamespace(roleName: string, namespace: string): string {
    return `${roleName}.${NamespaceType.Role}.${namespace}`;
  }

  static getOrgName(domain: string): string {
    return domain
      ?.split(`.${NamespaceType.Role}.`)
      ?.pop()
      ?.split(`.${NamespaceType.Application}.`)
      ?.pop();
  }

  static getAppName(domain: string): string {
    if (!domain?.includes(`.${NamespaceType.Application}.`)) {
      return '';
    }
    return domain
      ?.split(`.${NamespaceType.Role}.`)
      ?.pop()
      ?.split(`.${NamespaceType.Application}.`)
      ?.shift();
  }
}
