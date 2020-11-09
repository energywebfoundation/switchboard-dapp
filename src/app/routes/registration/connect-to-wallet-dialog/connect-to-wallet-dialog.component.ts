import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAM } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-connect-to-wallet-dialog',
  templateUrl: './connect-to-wallet-dialog.component.html',
  styleUrls: ['./connect-to-wallet-dialog.component.scss']
})
export class ConnectToWalletDialogComponent implements OnInit {
  isMetamaskExtensionAvailable = false;
  appName: string;

  constructor(private iamService: IamService, 
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ConnectToWalletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.appName = data.appName;
    }

  async ngOnInit() {
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
      // Close Login Dialog
      this.dialogRef.close();
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

      // Close Login Dialog
      this.dialogRef.close();
    }
  }
}
