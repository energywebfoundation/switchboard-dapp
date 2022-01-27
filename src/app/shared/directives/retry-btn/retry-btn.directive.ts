import {
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { Directive, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import {
  mapTo,
  scan,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../routes/widgets/confirmation-dialog/confirmation-dialog.component';

@Directive({
  selector: '[appRetryBtn]',
})
export class RetryBtnDirective implements OnDestroy {
  @HostBinding('disabled')
  isDisabled: boolean;

  @Output()
  appRetryBtn = new EventEmitter<void>();

  count = -1;

  private _counter;
  private _destroy;

  @HostListener('click', ['$event']) onClick() {
    const confirm$ = this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: 'Retry',
          message: 'WARNING: Retry transaction request will cost extra tokens.',
          isProceedButton: true,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((res: any) => {
        if (res) {
          this._start();
          this.appRetryBtn.emit();
        }
        confirm$.unsubscribe();
      });
  }

  constructor(private elementRef: ElementRef, private dialog: MatDialog) {
    this._start();
  }

  private _start() {
    this.isDisabled = true;
    this._counter = new Subject();
    this._destroy = new Subject();

    const counter$ = this._counter
      .pipe(
        switchMap((endValue: number) => {
          return timer(0, 1000).pipe(
            mapTo(1),
            startWith(endValue),
            scan((accumulator: number) => accumulator - 1),
            takeWhile(this._notZero(this.count))
          );
        }),
        takeUntil(this._destroy)
      )
      .subscribe((newCount: number) => {
        this.count = newCount;

        if (this.count === 0) {
          this.elementRef.nativeElement.innerText = `Retry`;
          this.isDisabled = false;
          counter$.unsubscribe();
          this._initiateDestroy();
        } else {
          this.elementRef.nativeElement.innerText = `Retry (${this.count})`;
        }
      });

    this._counter.next(environment.trxRetry);
  }

  ngOnDestroy(): void {
    this._initiateDestroy();
  }

  private _initiateDestroy(): void {
    if (!this._destroy.isStopped) {
      this._destroy.next();
      this._destroy.complete();
    }
  }

  // eslint-disable-next-line
  private _notZero(value: any) {
    return (value) => value >= 0;
  }
}
