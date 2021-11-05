import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';

@Component({
  selector: 'app-connect-buttons',
  templateUrl: './connect-buttons.component.html',
  styleUrls: ['./connect-buttons.component.scss']
})
export class ConnectButtonsComponent {
  @Input() metamaskPresent: boolean;
  @Input() metamaskDisabled: boolean;

  @Output() connectTo = new EventEmitter<WalletProvider>();

  connectToWalletConnect() {
    this.connectTo.emit(WalletProvider.WalletConnect);
  }

  connectToMetamask() {
    this.connectTo.emit(WalletProvider.MetaMask);
  }

  connectToEKC() {
    this.connectTo.emit(WalletProvider.EKC);
  }

}
