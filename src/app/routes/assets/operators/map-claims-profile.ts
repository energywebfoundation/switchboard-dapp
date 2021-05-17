import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ClaimData } from 'iam-client-lib';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';

export function mapClaimsProfile() {
  return (source: Observable<(IServiceEndpoint & ClaimData)[]>) => {
    return source.pipe(
      mergeMap((claimsData: (IServiceEndpoint & ClaimData)[]) => {
        const claimWithProfile = claimsData.filter(claim => !!claim.profile);
        return claimWithProfile.length > 0 ? claimWithProfile : [{ profile: null }];
      })
    );
  };
}
