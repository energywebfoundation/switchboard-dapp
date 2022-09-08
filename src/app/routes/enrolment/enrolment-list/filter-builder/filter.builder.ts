import { FilterStatus } from '../models/filter-status.enum';
import { ICascadingFilter } from '@modules';

export class FilterBuilder {
  private list: ICascadingFilter[];

  constructor(list: ICascadingFilter[]) {
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
      (item) => item.subject?.includes(value) || item.requester?.includes(value)
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

  private statusFilter(list: ICascadingFilter[], status: FilterStatus) {
    if (status === FilterStatus.All) {
      return list;
    }
    return list.filter((item) => item.status === status);
  }

  build(): ICascadingFilter[] {
    return this.list;
  }
}
