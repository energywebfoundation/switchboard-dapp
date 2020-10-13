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
  private loginStatus = undefined;

  constructor(private iamService: IamService, 
    private route: Router,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService) { 
      this.loginStatus = this.iamService.getLoginStatus();
      if (this.loginStatus === LoginType.LOCAL) {
        this.loadingService.show();
      }
      
  }

  ngOnInit() {
    console.log('accountAddress', this.iamService.user);

    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      let returnUrl = undefined;

      // Check Login
      if (this.loginStatus) {
        console.log(this.loginStatus);
        if (this.loginStatus === LoginType.LOCAL) {
          await this.iamService.login();
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
    });
  }

  goToGovernance() {
    this.route.navigate(['applications']); 
  }

  goToEnrolment() {
    this.route.navigate(['enrolment']); 
  }

}
