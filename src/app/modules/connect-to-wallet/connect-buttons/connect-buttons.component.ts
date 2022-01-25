import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProviderType } from 'iam-client-lib';
import { MetamaskProviderService } from '../../../shared/services/metamask-provider/metamask-provider.service';
import { EkcSettingsService } from '../ekc-settings/services/ekc-settings.service';

@Component({
  selector: 'app-connect-buttons',
  templateUrl: './connect-buttons.component.html',
  styleUrls: ['./connect-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectButtonsComponent {
  @Input() metamaskPresent: boolean;
  @Input() metamaskDisabled: boolean;
  @Input() showEkcOption: boolean;

  @Output() connectTo = new EventEmitter<ProviderType>();

  constructor(
    private metamaskProviderService: MetamaskProviderService,
    private ekcSettingsService: EkcSettingsService
  ) {}

  get fullNetworkName() {
    return this.metamaskProviderService.getFullNetworkName();
  }

  editEKCSettings() {
    this.ekcSettingsService.edit();
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
    await this.metamaskProviderService.importMetamaskConf();
  }
}
