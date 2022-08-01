import { FilterStatus } from '../models/filter-status.enum';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { ExpirationStatus } from '../../models/expiration-statys.enum';

export class FilterBuilder {
  private list: EnrolmentClaim[];

  constructor(list: EnrolmentClaim[]) {
    this.list = list;
  }

  namespace(value: string): FilterBuilder {
    if (!value) {
      return this;
    }

    this.list = this.list.filter((item) =>
      item.namespace.includes(value.toLowerCase())
    );

    return this;
  }

  did(value: string): FilterBuilder {
    if (!value) {
      return this;
    }

    this.list = this.list.filter(
      (item) => item.subject.includes(value) || item.requester.includes(value)
    );
    return this;
  }

  status(value: FilterStatus): FilterBuilder {
    this.list = this.statusFilter(this.list, value);
    return this;
  }

  organization(filter: string): FilterBuilder {
    if (!filter) {
      return this;
    }
    this.list = this.list.filter((claim) =>
      claim.organization.includes(filter)
    );

    return this;
  }

  application(filter: string): FilterBuilder {
    if (!filter) {
      return this;
    }

    this.list = this.list.filter((claim) =>
      claim.application?.includes(filter)
    );
    return this;
  }

  roleName(filter: string): FilterBuilder {
    if (!filter) {
      return this;
    }

    this.list = this.list.filter((claim) => claim.roleName?.includes(filter));

    return this;
  }

  private statusFilter(list: EnrolmentClaim[], status: FilterStatus) {
    if (status === FilterStatus.Pending) {
      return list.filter((item) => item.isPending);
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
      return list.filter((item) => !item.isRevoked);
    }

    if (status === FilterStatus.RevokedOffChainOnly) {
      return list.filter(
        (item) => item.isRevokedOffChain && !item.isRevokedOnChain
      );
    }
    if (status === FilterStatus.Expired) {
      return list.filter(
        (item) => item.expirationStatus === ExpirationStatus.EXPIRED
      );
    }
  }

  build(): EnrolmentClaim[] {
    return this.list;
  }
}
