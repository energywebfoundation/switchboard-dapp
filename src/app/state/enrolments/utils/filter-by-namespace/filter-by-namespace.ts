import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim.interface';

export const filterByNamespace = (
  list: EnrolmentClaim[],
  value: string
): EnrolmentClaim[] => {
  if (!value) {
    return list;
  }
  return list.filter((item) => item.namespace.includes(value));
};