import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private route: Router, private iamService: IamService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.iamService.getLoginStatus()) {
      this.route.navigate(['dashboard']);
    }
  }

  async connectToWallet() {
    this.spinner.show();
    let isLoggedIn = await this.iamService.login();
    if (isLoggedIn) {
      this.spinner.hide();
      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard']);
    }
  }
}
