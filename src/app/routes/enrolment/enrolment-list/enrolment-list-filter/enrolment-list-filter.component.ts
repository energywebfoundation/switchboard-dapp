import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { EnrolmentFilterListService } from '../services/enrolment-filter-list.service';
import { FilterStatus } from '../models/filter-status.enum';
import { RevokableFilterStatus } from '../models/revokable-filter-status.enum';
const INPUT_DEBOUNCE_TIME = 300;

@Component({
  selector: 'app-enrolment-list-filter',
  templateUrl: './enrolment-list-filter.component.html',
  styleUrls: ['./enrolment-list-filter.component.scss'],
})
export class EnrolmentListFilterComponent implements OnInit, OnDestroy {
  @Input() showDID = false;
  @Input() set showRevokeFilters(value: boolean){
    console.log(value, "THE VALUW!!!!!!")
    this.setFilters(value)
  }
  status$: Observable<FilterStatus> = this.enrolmentFilterListService.status$();
  statusButtons: string[];
  namespace: FormControl = new FormControl('');
  did: FormControl = new FormControl('');

  // public statusButtons = this.showRevokeFilters ? [
  //   RevokableFilterStatus.NotRevoked,
  //   RevokableFilterStatus.RevokedOffChainOnly,
  //   RevokableFilterStatus.Revoked
  // ] : [
  //   FilterStatus.All,
  //   FilterStatus.Pending,
  //   FilterStatus.Approved,
  //   FilterStatus.Rejected,
  //   FilterStatus.Revoked,
  // ];

  private destroy$ = new Subject();
  constructor(private enrolmentFilterListService: EnrolmentFilterListService) {}

  ngOnInit() {
  
    this.namespace.valueChanges
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.enrolmentFilterListService.setNamespace(value)
      );

    this.did.valueChanges
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((value) => this.enrolmentFilterListService.setDid(value));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateSearchByDidValue(did: string) {
    this.enrolmentFilterListService.setDid(did);
  }

  statusChangeHandler(value: FilterStatus) {
    console.log(value, "THE VALUE in STATUS CHANGE HANDLER")
    this.enrolmentFilterListService.setStatus(value);
  }

  public async setFilters(showRevokeFilters: boolean) {
    this.statusButtons =  showRevokeFilters ? [
      FilterStatus.All,
      FilterStatus.NotRevoked,
      FilterStatus.RevokedOffChainOnly,
      FilterStatus.Revoked
    ] : [
      FilterStatus.All,
      FilterStatus.Pending,
      FilterStatus.Approved,
      FilterStatus.Rejected,
      FilterStatus.Revoked,
    ]
  }
}
