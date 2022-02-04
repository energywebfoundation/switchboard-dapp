import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClaimData } from 'iam-client-lib';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';

export function mapClaimsProfile() {
  return (source: Observable<(IServiceEndpoint & ClaimData)[]>) => {
    return source.pipe(
      map((claimsData: (IServiceEndpoint & ClaimData)[]) => {
        const claimWithProfile = claimsData
          .filter((claim) => !!claim.profile)
          .reduce(
            (prev, next) => {
              const isPrevNewerClaim = prev.iat > next.iat;
              return isPrevNewerClaim ? prev : next;
            },
            { iat: 0 }
          ) as IServiceEndpoint & ClaimData;

        return claimWithProfile.profile || {};
      })
    );
  };
}
