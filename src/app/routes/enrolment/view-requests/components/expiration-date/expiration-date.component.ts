import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expiration-date',
  templateUrl: './expiration-date.component.html',
  styleUrls: ['./expiration-date.component.scss'],
})
export class ExpirationDateComponent implements OnInit, OnDestroy {
  @Input() defaultValidityPeriod: number;
  @Input() defaultValidityPeriodFormatted: string;
  @Output() add: EventEmitter<number> = new EventEmitter<number>();

  expirationDate = new FormControl('');
  expirationTimeShift: number;
  minDate = new Date(Date.now());
  hideRemoveButton = false;
  showRestoreBtn = this.showRestoreButton();

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.defaultExpirationDate();
    this.expirationDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.expirationTimeShift = this.calcSeconds(value);
        this.add.emit(this.expirationTimeShift);
        this.hideRemoveButton = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeHandler(): void {
    this.expirationDate.setValue('');
    this.add.emit(undefined);
    this.hideRemoveButton = true;
  }

  showRestoreButton(): boolean {
    return (
      (this.defaultValidityPeriod &&
        this.expirationTimeShift &&
        this.defaultValidityPeriod !== this.expirationTimeShift) ||
      (this.hideRemoveButton && !!this.defaultValidityPeriod)
    );
  }

  showRemoveButton(): boolean {
    return (
      !this.hideRemoveButton &&
      (!!this.defaultValidityPeriod || !!this.expirationTimeShift)
    );
  }

  restoreDefaultHandler(): void {
    this.add.emit(this.defaultValidityPeriod);
    this.expirationDate.setValue(
      new Date(Date.now() + this.defaultValidityPeriod * 1000)
    );
    this.expirationTimeShift = this.defaultValidityPeriod;
    this.hideRemoveButton = false;
  }

  defaultExpirationDate() {
    if (this.defaultValidityPeriod) {
      this.expirationDate.setValue(
        new Date(Date.now() + this.defaultValidityPeriod * 1000)
      );
      this.expirationTimeShift = this.defaultValidityPeriod;
    }
  }

  setDefaultExpirationDate() {
    this.expirationDate.setValue(
      new Date(Date.now() + this.defaultValidityPeriod * 1000)
    );
    this.add.emit(this.defaultValidityPeriod);
    this.expirationTimeShift = this.defaultValidityPeriod;
    this.hideRemoveButton = false;
  }

  private calcSeconds(value: string): number {
    const d = new Date(value);
    return Math.round((d.getTime() - Date.now()) / 1000) + this.getHoursShift();
  }

  private getHoursShift() {
    const now = new Date(Date.now());
    return (
      now.getUTCSeconds() +
      now.getUTCMinutes() * 60 +
      now.getUTCHours() * 60 * 60
    );
  }
}

