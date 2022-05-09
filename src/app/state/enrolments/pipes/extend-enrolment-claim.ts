import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { NamespaceType } from 'iam-client-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const extendEnrolmentClaim =
  () => (source: Observable<EnrolmentClaim[]>) => {
    return source.pipe(
      map((enrolments: EnrolmentClaim[]) => {
        return enrolments.map((item) => {
          const arr = item.claimType.split(`.${NamespaceType.Role}.`);
          return {
            ...item,
            requestDate: new Date(item.createdAt),
            roleName: arr[0],
          };
        });
      })
    );
  };
