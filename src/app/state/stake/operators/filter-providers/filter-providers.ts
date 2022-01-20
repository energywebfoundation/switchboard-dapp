import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, IOrganization } from 'iam-client-lib';

export function filterProviders() {
  return (source: Observable<[Service[], IOrganization[]]>) => {
    return source.pipe(
      map(([services, organizations]) =>
        services.map((service) => {
          const org = organizations.find(
            (org) => org.namespace === service.org
          );
          if (org) {
            return { ...org, ...service };
          }
        })
      )
    );
  };
}
