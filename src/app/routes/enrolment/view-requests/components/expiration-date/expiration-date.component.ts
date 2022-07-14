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
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expiration-date',
  templateUrl: './expiration-date.component.html',
  styleUrls: ['./expiration-date.component.scss'],
})
export class ExpirationDateComponent implements OnInit, OnDestroy {
  @Input() defaultTimeShift: number;
  @Output() add = new EventEmitter<number>();

  toggle = false;
  expirationDate = new FormControl('');

  private destroy$ = new Subject();

  ngOnInit(): void {
    if (this.defaultTimeShift) {
      this.expirationDate.setValue(
        new Date(Date.now() + this.defaultTimeShift * 1000)
      );
    }
    this.expirationDate.valueChanges
      .pipe(
        filter(() => this.toggle),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        console.log(this.calcSeconds(value));
        this.add.emit(this.calcSeconds(value));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleHandler(): void {
    this.toggle = !this.toggle;
  }

  removeHandler(): void {
    this.expirationDate.setValue('');
    this.add.emit(undefined);
  }

  setDefaultExpirationDate() {
    this.expirationDate.setValue(
      new Date(Date.now() + this.defaultTimeShift * 1000)
    );
    this.add.emit(this.defaultTimeShift);
  }

  private calcSeconds(value: string): number {
    const d = new Date(value);
    return Math.round((d.getTime() - Date.now()) / 1000);
  }
}
