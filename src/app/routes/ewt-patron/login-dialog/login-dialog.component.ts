import { Component, OnInit } from '@angular/core';
import { IAM } from '../../../../../../iam-client-lib';
import { VOLTA_CHAIN_ID } from '../../../shared/services/iam.service';
import { PatronService } from '../patron.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  isMetamaskExtensionAvailable: boolean;
  disableMetamaskButton: boolean;

  constructor(private patronService: PatronService,
              private dialogRef: MatDialogRef<LoginDialogComponent>) {
  }

  ngOnInit() {
    this.handleMetaMaskButton();
  }

  async handleMetaMaskButton() {
    const {isMetamaskPresent, chainId} = await IAM.isMetamaskExtensionPresent();
    if (isMetamaskPresent) {
      this.isMetamaskExtensionAvailable = true;

      if (chainId && parseInt(`${chainId}`, 16) !== VOLTA_CHAIN_ID) {
        this.disableMetamaskButton = true;
      }
    }
  }

  connectToMetamask() {
    this.patronService.login();
  }

}