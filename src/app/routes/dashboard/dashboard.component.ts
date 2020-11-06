import { Component, OnInit } from '@angular/core';
import { IamService, LoginType } from 'src/app/shared/services/iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public accountDid = "";
  public userName = "";
  private loginStatus = undefined;

  constructor(private iamService: IamService, 
    private route: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService) { 
      this.loadingService.show();
      this.loginStatus = this.iamService.getLoginStatus();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {

      let returnUrl = undefined;

      // Check Login
      if (this.loginStatus) {
        console.log(this.loginStatus);
        if (this.loginStatus === LoginType.LOCAL) {
          console.log('local > login');

          // Set metamask extension options if connecting with metamask extension
          let useMetamaskExtension = undefined;
          if (window.localStorage.getItem('METAMASK_EXT_CONNECTED')) {
            useMetamaskExtension = true;
          }

          // Proceed Login
          await this.iamService.login(useMetamaskExtension);
        }

        // Setup User Data
        await this.iamService.setupUser();
        this.accountDid = this.iamService.iam.getDid();

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
      this.loadingService.hide();
      if (returnUrl) {
        this.route.navigateByUrl(returnUrl);
      }
      else {
        // Stay in current screen and display user name if available
        this.iamService.userProfile.subscribe((data: any) => {
          if (data && data.name) {
            this.userName = data.name;
          }
        });
      }
    });
  }

  goToGovernance() {
    this.route.navigate(['governance']); 
  }

  goToEnrolment() {
    this.route.navigate(['enrolment']); 
  }

}
