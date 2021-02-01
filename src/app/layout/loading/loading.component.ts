import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from 'src/app/shared/services/loading.service';

export const CancelButton = {
  ENABLED: true,
  DISABLED: false
};

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public showLoadingOverlay = false;
  public isCancellable = false;
  public msg = '';
  public msgList: string[];
  constructor(private spinner: NgxSpinnerService, private loadingService: LoadingService) { }

  ngOnInit() {
    // Subscribe to cancellable event
    this.loadingService.isCancellable.subscribe((isCancellable: boolean) => {
      let $setTimeout = setTimeout(() => {
        this.isCancellable = isCancellable;
        clearTimeout($setTimeout);
      }, 30);
    });

    // Subscribe to msg event
    this.loadingService.message.subscribe((message: any) => {
      let $setTimeout = setTimeout(() => {
        if (typeof message === 'string') {
          this.msg = message;
          this.msgList = undefined;
        }
        else {
          this.msgList = message;
          this.msg = '';
        }
        clearTimeout($setTimeout);
      }, 30);
    });

    // Subscribe to isLoading event
    this.loadingService.isLoading.subscribe((isLoading: number) => {
      let $setTimeout = setTimeout(() => {
        if (isLoading > 0) {
          // Show if isLoading has requests
          this.showLoadingOverlay = true;
          this.spinner.show();
        }
        else {
          // Hide if isLoading has lesser requests
          this.showLoadingOverlay = false;
          this.spinner.hide();
        }
        clearTimeout($setTimeout);
      }, 30);
    });
  }

  cancel() {
    this.loadingService.hide();
  }
}
