import { Injectable } from '@angular/core';
import { safeAppSdk } from './gnosis.safe.service';
import { SafeInfo } from '@gnosis.pm/safe-apps-sdk';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public safeInfo: SafeInfo;

  loadConfigData() {
    return new Promise<void>((resolve) => {
      safeAppSdk.safe.getInfo().then((safeInfo: SafeInfo) => {
        this.safeInfo = safeInfo;
      });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
