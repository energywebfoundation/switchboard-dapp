import { Injectable } from '@angular/core';
import { IAM } from 'iam-client-lib';

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private _iam: IAM;
  private _user: any;

  private _localStorage: any;

  constructor() {
    console.log('initializing IAM...');
    this._user = {};
    this._iam = new IAM({
      rpc: {
        73799: 'https://volta-rpc.energyweb.org/'
      }
    });
  }

  async login(): Promise<boolean> {
    const { did, connected } = await this._iam.login();
    const signer = this._iam.getSigner();

    console.log('did', did);
    console.log('signer', signer);
    console.log('connected', connected);

    const account = await signer.provider.listAccounts();
    if (account && account.length > 0) {
      this._user['accountAddress'] = account[0];
    }

    if (did && connected) {
      return true;
    }
    else {
      return false;
    }
  }

  get iam(): IAM {
    return this._iam;
  }

  get user() {
    return JSON.parse(JSON.stringify(this._user));
  }
}
