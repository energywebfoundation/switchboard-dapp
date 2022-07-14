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

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.defaultExpirationDate();
    this.expirationDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
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
    }
  }

  setDefaultExpirationDate() {
    this.expirationDate.setValue(
      new Date(Date.now() + this.defaultValidityPeriod * 1000)
    );
    this.add.emit(this.defaultValidityPeriod);
  }

  private calcSeconds(value: string): number {
    const d = new Date(value);
    return Math.round((d.getTime() - Date.now()) / 1000);
  }
}
