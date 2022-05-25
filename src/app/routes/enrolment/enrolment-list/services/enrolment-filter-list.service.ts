import { Injectable, OnDestroy } from '@angular/core';
import { EnrolmentClaim } from '../../models/enrolment-claim.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterStatus } from '../enrolment-list-filter/enrolment-list-filter.component';
import { statusFilter } from '../../../../state/enrolments/utils/status-filter/status-filter';
import { filterByNamespace } from '../../../../state/enrolments/utils/filter-by-namespace/filter-by-namespace';
import { filterByDid } from '../../../../state/enrolments/utils/filter-by-did/filter-by-did';

@Injectable()
export class EnrolmentFilterListService {
  private filteredList: Subject<EnrolmentClaim[]> = new BehaviorSubject([]);
  private originalList: BehaviorSubject<EnrolmentClaim[]> = new BehaviorSubject(
    []
  );
  private _namespace: BehaviorSubject<string> = new BehaviorSubject('');
  private _did: BehaviorSubject<string> = new BehaviorSubject('');
  private _status: BehaviorSubject<FilterStatus> = new BehaviorSubject(
    FilterStatus.All
  );

  setList(list: EnrolmentClaim[]) {
    this.originalList.next(list);
    this.filteredList.next(
      this.filter(
        list,
        this._did.value,
        this._namespace.value,
        this._status.value
      )
    );
  }

  setNamespace(namespace: string) {
    if (namespace === this._namespace.value) {
      return;
    }
    this._namespace.next(namespace);
    this.filteredList.next(
      this.filter(
        this.originalList.value,
        this._did.value,
        namespace,
        this._status.value
      )
    );
  }

  setDid(did: string) {
    if (did === this._did.value) {
      return;
    }
    this._did.next(did);
    this.filteredList.next(
      this.filter(
        this.originalList.value,
        did,
        this._namespace.value,
        this._status.value
      )
    );
  }

  setStatus(status: FilterStatus) {
    if (!status) {
      return;
    }
    if (status === this._status.value) {
      return;
    }
    this._status.next(status);
    this.filteredList.next(
      this.filter(
        this.originalList.value,
        this._did.value,
        this._namespace.value,
        status
      )
    );
  }
  status$() {
    return this._status.asObservable();
  }

  get filteredList$() {
    return this.filteredList.asObservable();
  }

  private filter(
    list: EnrolmentClaim[],
    didFilter: string,
    namespaceFilter: string,
    status: FilterStatus
  ) {
    return statusFilter(
      filterByNamespace(filterByDid(list, didFilter), namespaceFilter),
      status
    );
  }
}
