import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { ProviderEvent } from 'iam-client-lib/dist/src/modules/signer/signer.types';

@Injectable({
  providedIn: 'root',
})
export class SignerFacadeService {
  constructor(private iamService: IamService) {}

  getDid() {
    return this.iamService.signerService.did;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ProviderEvent, cb: any) {
    this.iamService.signerService.on(event, cb);
  }
}
