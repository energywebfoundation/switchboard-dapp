import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';

export const statusFilter = (list: EnrolmentClaim[], status: FilterStatus) => {
  if (status === FilterStatus.Pending) {
    return list.filter((item) => !item.isAccepted && !item.isRejected);
  }

  if (status === FilterStatus.Rejected) {
    return list.filter((item) => item.isRejected);
  }

  if (status === FilterStatus.Approved) {
    return list.filter((item) => item.isAccepted);
  }

  if (status === FilterStatus.Revoked) {
    return list.filter((item) => item.isRevoked);
  }

  if (status === FilterStatus.All) {
    return list;
  }
};
