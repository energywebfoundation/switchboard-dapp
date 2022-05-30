import { EnrolmentClaim } from '../../../models/enrolment-claim.interface';
import { FilterStatus } from '../../models/filter-status.enum';

export const statusFilter = (list: EnrolmentClaim[], status: FilterStatus) => {
  if (status === FilterStatus.Pending) {
    return list.filter((item) => !item.isAccepted && !item.isRejected);
  }

  if (status === FilterStatus.Rejected) {
    return list.filter((item) => item.isRejected);
  }

  if (status === FilterStatus.Approved) {
    return list
      .filter((item) => !item.isRevoked)
      .filter((item) => item.isAccepted);
  }

  if (status === FilterStatus.Revoked) {
    return list.filter((item) => item.isRevoked);
  }

  if (status === FilterStatus.All) {
    return list;
  }
};
