import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAM } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isMetamaskExtensionAvailable = false;

  constructor(private route: Router, private iamService: IamService, private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.iamService.getLoginStatus()) {
      this.route.navigate(['dashboard']);
    }

    // Check metamask availability
    if (await IAM.isMetamaskExtensionPresent()) {
      this.isMetamaskExtensionAvailable = true;
    }
  }

  async connectToWallet() {
    this.spinner.show();
    let isLoggedIn = await this.iamService.login();
    this.spinner.hide();
    if (isLoggedIn) {
      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard']);
    }
    else {
      await this.cleanMe();
    }
  }

  async connectToMetamask() {
    // Make sure that localStorage is supported
    if (!window.localStorage) {
      this.toastr.error('Local data storage is not supported in this browser.', 'Connect with Metamask');
      return;
    }

    // Proceed with Login Process
    this.spinner.show();
    let isLoggedIn = await this.iamService.login(true, true);
    this.spinner.hide();

    if (isLoggedIn) {
      // Set LocalStorage for Metamask
      localStorage['METAMASK_EXT_CONNECTED'] = true;

      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard']);
    }
    else {
      await this.cleanMe();
    }
  }
  
  private async cleanMe() {
    this.iamService.logout();
    let $navigate = setTimeout(() => {
        clearTimeout($navigate);
        location.reload();
    }, 100);
  }
}
