import { Injectable } from '@angular/core';
import {ProviderEvent} from 'iam-client-lib'
import { IamService } from '../iam.service';

export enum ProviderEventsEnum {
  AccountChanged = 'accountChanged',
  NetworkChanged = 'networkChanged',
  Disconnected = 'disconnected'
}

@Injectable({
  providedIn: 'root'
})
export class IamListenerService {

  constructor(private iamService: IamService) {
  }

  setListeners(callback: (config) => void) {
    this.iamService.signerService.on(ProviderEvent.AccountChanged, () => {
      this._displayAccountAndNetworkChanges(ProviderEvent.AccountChanged, callback);
    });

    this.iamService.signerService.on(ProviderEvent.NetworkChanged, () => {
      this._displayAccountAndNetworkChanges(ProviderEvent.NetworkChanged, callback);
    });

    this.iamService.signerService.on(ProviderEvent.Disconnected, () => {
      this._displayAccountAndNetworkChanges(ProviderEvent.Disconnected, callback);
    });
  }

  private _displayAccountAndNetworkChanges(changeType: ProviderEvent, callback: (config) => void): void {
    const {message, title} = this.getSwalConfigInfo(changeType);

    const config = {
      title,
      text: `${message} Please login again.`,
      icon: 'warning',
      button: 'Proceed',
      closeOnClickOutside: false
    };
    callback(config);
  }

  private getSwalConfigInfo(type: ProviderEvent) {
    switch (type) {
      case ProviderEvent.AccountChanged:
        return {
          title: 'Account Changed',
          message: 'Account is changed.'
        };
      case ProviderEvent.NetworkChanged:
        return {
          title: 'Network Changed',
          message: 'Network is changed.'
        };
      case ProviderEvent.Disconnected:
        return {
          title: 'Disconnected',
          message: 'You are disconnected from your wallet.'
        };
    }
  }
}
