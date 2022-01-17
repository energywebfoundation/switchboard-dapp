import { AfterViewInit, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';

export const CancelButton = {
  ENABLED: true,
  DISABLED: false,
};

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements AfterViewInit {
  public showLoadingOverlay = true;
  public isCancellable = false;
  public msg = '';
  public msgList: string[];
  loaderColor: string;

  constructor(
    private spinner: NgxSpinnerService,
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(
      () =>
        (this.loaderColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--loader-color')),
      100
    );
    // Subscribe to cancellable event
    this.loadingService.isCancellable.subscribe((isCancellable: boolean) => {
      const $setTimeout = setTimeout(() => {
        this.isCancellable = isCancellable;
        clearTimeout($setTimeout);
      }, 30);
    });

    // Subscribe to msg event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.loadingService.message.subscribe((message: any) => {
      const $setTimeout = setTimeout(() => {
        if (typeof message === 'string') {
          this.msg = message;
          this.msgList = undefined;
        } else {
          this.msgList = message;
          this.msg = '';
        }
        clearTimeout($setTimeout);
      }, 30);
    });

    // Subscribe to isLoading event
    this.loadingService.isLoading.subscribe((isLoading: number) => {
      const $setTimeout = setTimeout(() => {
        if (isLoading > 0) {
          // Show if isLoading has requests
          this.showLoadingOverlay = true;
          this.spinner.show();
        } else {
          // Hide if isLoading has lesser requests
          this.showLoadingOverlay = false;
          of(null)
            .pipe(take(1), delay(40))
            .subscribe(() => {
              this.spinner.hide();
            });
        }
        clearTimeout($setTimeout);
      }, 30);
    });
  }

  cancel() {
    this.loadingService.hide();
  }
}
