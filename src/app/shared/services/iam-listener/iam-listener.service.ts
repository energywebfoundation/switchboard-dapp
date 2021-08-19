import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import SWAL from 'sweetalert';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';


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

  setListeners(callback: () => void) {
    this.iamService.iam.on(ProviderEventsEnum.AccountChanged, () => {
      this._displayAccountAndNetworkChanges(ProviderEventsEnum.AccountChanged, callback);
    });

    this.iamService.iam.on(ProviderEventsEnum.NetworkChanged, () => {
      this._displayAccountAndNetworkChanges(ProviderEventsEnum.NetworkChanged, callback);
    });

    this.iamService.iam.on(ProviderEventsEnum.Disconnected, () => {
      this._displayAccountAndNetworkChanges(ProviderEventsEnum.Disconnected, callback);
    });
  }

  private _displayAccountAndNetworkChanges(changeType: ProviderEventsEnum, callback: () => void): void {
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

  private getSwalConfigInfo(type: ProviderEventsEnum) {
    switch (type) {
      case ProviderEventsEnum.AccountChanged:
        return {
          title: 'Account Changed',
          message: 'Account is changed.'
        };
      case ProviderEventsEnum.NetworkChanged:
        return {
          title: 'Network Changed',
          message: 'Network is changed.'
        };
      case ProviderEventsEnum.Disconnected:
        return {
          title: 'Disconnected',
          message: 'You are disconnected from your wallet.'
        };
    }
  }
}
