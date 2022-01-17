import { OrganizationProvider } from '../models/organization-provider.interface';

export const updateHistory = (
  list: OrganizationProvider[],
  history: OrganizationProvider[]
) => {
  return history.map((histEl) => {
    const listEl = list.find((element) => element.id === histEl.id);
    return {
      ...histEl,
      containsApps: !!listEl?.containsApps,
      containsRoles: !!listEl?.containsRoles,
    };
  });
};
