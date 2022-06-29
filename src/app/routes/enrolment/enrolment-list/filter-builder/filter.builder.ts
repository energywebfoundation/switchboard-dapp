import { FilterStatus } from '../models/filter-status.enum';
import { EnrolmentClaim } from '../../models/enrolment-claim';

export class FilterBuilder {
  private list: EnrolmentClaim[];

  constructor(list: EnrolmentClaim[]) {
    this.list = list;
  }

  namespace(value: string) {
    if (!value) {
      return this;
    }

    this.list = this.list.filter((item) =>
      item.namespace.includes(value.toLowerCase())
    );

    return this;
  }

  did(value: string) {
    if (!value) {
      return this;
    }

    this.list = this.list.filter(
      (item) => item.subject.includes(value) || item.requester.includes(value)
    );
    return this;
  }

  status(value: FilterStatus) {
    this.list = this.statusFilter(this.list, value);
    return this;
  }

  private statusFilter(list: EnrolmentClaim[], status: FilterStatus) {
    if (status === FilterStatus.Pending) {
      return list.filter(
        (item) =>
          !item.isAccepted &&
          !item.isRejected &&
          !item.isRevokedOffChain &&
          !item.isRevokedOnChain
      );
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
      return list.filter(
        (item) =>
          item.isRevokedOnChain &&
          (!item.isRevocableOffChain || item.isRevokedOffChain)
      );
    }

    if (status === FilterStatus.All) {
      return list;
    }

    if (status === FilterStatus.NotRevoked) {
      return list.filter(
        (item) =>
          !item.isRevoked && !item.isRevokedOffChain && !item.isRevokedOnChain
      );
    }

    if (status === FilterStatus.RevokedOffChainOnly) {
      return list.filter(
        (item) => item.isRevokedOffChain && !item.isRevokedOnChain
      );
    }
  }

  build() {
    return this.list;
  }
}
