import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import SWAL from 'sweetalert';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';


export enum Wallet_Provider_Events {
  AccountChanged = 'EVENT_ACCOUNT_CHANGED',
  NetworkChanged = 'EVENT_NETWORK_CHANGED',
  Disconnected = 'EVENT_DISCONNECTED'
}

@Injectable({
  providedIn: 'root'
})
export class IamListenerService {

  constructor(private iamService: IamService) {
  }

  setListeners(callback: () => void) {
    // Listen to Account Change
    this.iamService.iam.on('accountChanged', () => {
      this._displayAccountAndNetworkChanges(Wallet_Provider_Events.AccountChanged, callback);
    });

    // Listen to Network Change
    this.iamService.iam.on('networkChanged', () => {
      this._displayAccountAndNetworkChanges(Wallet_Provider_Events.NetworkChanged, callback);
    });

    // Listen to Disconnection
    this.iamService.iam.on('disconnected', () => {
      this._displayAccountAndNetworkChanges(Wallet_Provider_Events.Disconnected, callback);
    });
  }

  private _displayAccountAndNetworkChanges(changeType: Wallet_Provider_Events, callback: () => void): void {
    const {message, title} = this.getSwalConfigInfo(changeType);

    const config = {
      title,
      text: `${message} Please login again.`,
      icon: 'warning',
      button: 'Proceed',
      closeOnClickOutside: false
    };

    from(SWAL(config)).pipe(take(1)).subscribe(() => {
      callback();
    });
  }

  private getSwalConfigInfo(type: Wallet_Provider_Events) {
    switch (type) {
      case Wallet_Provider_Events.AccountChanged:
        return {
          title: 'Account Changed',
          message: 'Account is changed.'
        };
      case Wallet_Provider_Events.NetworkChanged:
        return {
          title: 'Network Changed',
          message: 'Network is changed.'
        };
      case Wallet_Provider_Events.Disconnected:
        return {
          title: 'Disconnected',
          message: 'You are disconnected from your wallet.'
        };
    }
  }
}
