import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public showLoadingOverlay = false;
  public msg = '';
  public msgList: string[];
  constructor(private spinner: NgxSpinnerService, private loadingService: LoadingService) { }

  ngOnInit() {
    // Subscribe to msg event
    this.loadingService.message.subscribe((message: any) => {
      let $setTimeout = setTimeout(() => {
        if (typeof message === 'string') {
          this.msg = message;
        }
        else {
          this.msgList = message;
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

}
