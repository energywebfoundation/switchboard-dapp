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
  @Output() add: EventEmitter<number> = new EventEmitter<number>();

  expirationDate = new FormControl('');
  expirationTimeShift: number;
  minDate = new Date(Date.now());

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.defaultExpirationDate();
    this.expirationDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log('this.expirationTimeShift', this.calcSeconds(value));
        this.expirationTimeShift = this.calcSeconds(value);
        this.add.emit(this.expirationTimeShift);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeHandler(): void {
    this.expirationDate.setValue('');
    this.add.emit(undefined);
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
  }

  private calcSeconds(value: string): number {
    const d = new Date(value);
    console.log(this.getHoursShift());
    return Math.round((d.getTime() - Date.now()) / 1000) + this.getHoursShift();
  }

  private getHoursShift() {
    const now = new Date(Date.now());
    return now.getUTCSeconds() + now.getUTCMinutes() * 60 + now.getUTCHours() * 60 * 60;
  }
}
