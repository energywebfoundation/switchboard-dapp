import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum FilterStatus {
  All = 'All',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Revoked = 'Revoked',
}

const INPUT_DEBOUNCE_TIME = 300;

@Component({
  selector: 'app-enrolment-list-filter',
  templateUrl: './enrolment-list-filter.component.html',
  styleUrls: ['./enrolment-list-filter.component.scss'],
})
export class EnrolmentListFilterComponent implements OnInit, OnDestroy {
  @Input() status: FilterStatus;
  @Input() showDID = false;

  @Output() scannedDID = new EventEmitter<string>();
  @Output() updateStatus = new EventEmitter<FilterStatus>();
  @Output() namespaceChange = new EventEmitter<string>();
  @Output() didChange = new EventEmitter<string>();

  namespace: FormControl = new FormControl('');
  did: FormControl = new FormControl('');

  public statusButtons = [
    FilterStatus.All,
    FilterStatus.Pending,
    FilterStatus.Approved,
    FilterStatus.Rejected,
    FilterStatus.Revoked,
  ];

  private destroy$ = new Subject();

  ngOnInit() {
    this.namespace.valueChanges
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((value) => this.namespaceChange.emit(value));

    this.did.valueChanges
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((value) => this.didChange.emit(value));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateSearchByDidValue(did: string) {
    this.scannedDID.emit(did);
  }

  statusChangeHandler(value: FilterStatus) {
    this.updateStatus.emit(value);
  }
}
