import { EnrolmentClaim } from 'src/app/routes/enrolment/models/enrolment-claim'; 
import { NamespaceType } from 'iam-client-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//HERE IT IS


export const extendEnrolmentClaim =
  () => (source: Observable<EnrolmentClaim[]>) => {
    return source.pipe(
      map((enrolments: EnrolmentClaim[]) => {
        return enrolments.map((item: EnrolmentClaim) => {
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
