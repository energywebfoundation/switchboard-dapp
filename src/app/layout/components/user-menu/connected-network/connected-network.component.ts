import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';

const ICON_MAP = new Map()
  .set('Azure', 'assets/img/icons/azure-logo-icon.svg')
  .set(WalletProvider.WalletConnect, 'assets/img/icons/wallet-connect-icon.svg')
  .set(WalletProvider.EwKeyManager, 'assets/img/icons/key-manager-icon.svg')
  .set(WalletProvider.MetaMask, 'assets/img/icons/metamask-logo.svg');


@Component({
  selector: 'app-connected-network',
  templateUrl: './connected-network.component.html',
  styleUrls: ['./connected-network.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectedNetworkComponent implements OnInit {
  @Input() chainName: string;
  @Input() wallet: WalletProvider | string;
  walletIcon: string;

  ngOnInit(): void {
    this.setIcon();
  }

  setIcon() {
    ICON_MAP.has(this.wallet) ? this.walletIcon = ICON_MAP.get(this.wallet) : console.error('Not supported provider for icons.');
  }
}
