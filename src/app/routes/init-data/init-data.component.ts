import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IamService, LoginType } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-init-data',
  templateUrl: './init-data.component.html',
  styleUrls: ['./init-data.component.scss']
})
export class InitDataComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, 
    private iamService: IamService, 
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.spinner.show();
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      let returnUrl = '/dashboard';

      // Check Login
      let loginStatus = this.iamService.getLoginStatus();
      if (loginStatus) {
        console.log(loginStatus);
        if (loginStatus === LoginType.LOCAL) {
          await this.iamService.login();
        }

        // Setup User Data
        await this.iamService.setupUser();

        // Check if returnUrl is available or just redirect to dashboard
        if (queryParams && queryParams.returnUrl) {
          returnUrl = queryParams.returnUrl;
        }
      }
      else {
        // Redirect to login screen if user  is not yet logged-in
        returnUrl = '/welcome';
      }
      
      // Redirect to actual screen
      this.route.navigateByUrl(returnUrl);
    });
    this.spinner.hide();
  }

}
