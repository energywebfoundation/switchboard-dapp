import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim.interface';

export const filterByDid = (list: EnrolmentClaim[], value: string): EnrolmentClaim[] => {
  if (!value) {
    return list;
  }
  return list.filter(
    (item) => item.subject.includes(value) || item.requester.includes(value)
  );
}
