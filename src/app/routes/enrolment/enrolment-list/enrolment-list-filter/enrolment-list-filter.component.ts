import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { EnrolmentFilterListService } from '../services/enrolment-filter-list.service';
import { FilterStatus } from '../models/filter-status.enum';

const INPUT_DEBOUNCE_TIME = 300;

@Component({
  selector: 'app-enrolment-list-filter',
  templateUrl: './enrolment-list-filter.component.html',
  styleUrls: ['./enrolment-list-filter.component.scss'],
})
export class EnrolmentListFilterComponent implements OnInit, OnDestroy {
  @Input() showDID = false;
  @Input() set enrolmentViewFilters(value: FilterStatus[]) {
    this.statusButtons = value;
  }
  status$: Observable<FilterStatus> = this.enrolmentFilterListService.status$();
  statusButtons: string[];
  namespace: FormControl = new FormControl('');
  did: FormControl = new FormControl('');

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
    this.enrolmentFilterListService.setStatus(value);
  }
}
