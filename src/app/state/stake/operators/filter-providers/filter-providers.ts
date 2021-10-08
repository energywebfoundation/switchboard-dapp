import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from 'iam-client-lib/dist/src/staking';
import { IOrganization } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';

export function filterProviders() {
  return (source: Observable<[Service[], IOrganization[]]>) => {
    return source.pipe(
      map(([services, organizations]) => services.map((service) => {
          const org = organizations.find((org) => org.namespace === service.org);
          if (org) {
            return {...org, ...service};
          }
        })
      )
    );
  };
};
