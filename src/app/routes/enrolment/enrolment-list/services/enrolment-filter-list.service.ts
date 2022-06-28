import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../models/enrolment-claim.interface';
import { BehaviorSubject } from 'rxjs';
import { FilterStatus } from '../models/filter-status.enum';
import { FilterBuilder } from '../filter-builder/filter.builder';

@Injectable()
export class EnrolmentFilterListService {
  private filteredList: BehaviorSubject<EnrolmentClaim[]> = new BehaviorSubject(
    []
  );
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
    this.filter();
  }

  setNamespace(namespace: string) {
    if (namespace === this._namespace.value) {
      return;
    }
    this._namespace.next(namespace);
    this.filter();
  }

  setDid(did: string) {
    if (did === this._did.value) {
      return;
    }
    this._did.next(did);
    this.filter();
  }

  setStatus(status: FilterStatus) {
    console.log(status, "THE FILTER STATUS IN SET STATS")
    if (!status) {
      return;
    }
    if (status === this._status.value) {
      return;
    }
    this._status.next(status);
    this.filter();
  }
  status$() {
    return this._status.asObservable();
  }

  get filteredList$() {
    return this.filteredList.asObservable();
  }

  private filter() {
    this.filteredList.next(
      new FilterBuilder(this.originalList.value)
        .status(this._status.value)
        .namespace(this._namespace.value)
        .did(this._did.value)
        .build()
    );
  }
}
