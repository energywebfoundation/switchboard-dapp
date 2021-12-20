import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProviderType } from 'iam-client-lib';

@Component({
  selector: 'app-connect-buttons',
  templateUrl: './connect-buttons.component.html',
  styleUrls: ['./connect-buttons.component.scss']
})
export class ConnectButtonsComponent {
  @Input() metamaskPresent: boolean;
  @Input() metamaskDisabled: boolean;
  @Input() showEkcOption: boolean;

  @Output() connectTo = new EventEmitter<ProviderType>();

  constructor(private metamaskProviderService: MetamaskProviderService) {
  }

  connectToWalletConnect() {
    this.connectTo.emit(ProviderType.WalletConnect);
  }

  connectToMetamask() {
    this.connectTo.emit(ProviderType.MetaMask);
  }

  connectToEKC() {
    this.connectTo.emit(ProviderType.EKC);
  }

  async importMetamaskConf() {
    this.metamaskProviderService.importMetamaskConf();
  }

}
