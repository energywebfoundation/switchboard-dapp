import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';

@Injectable({
  providedIn: 'root'
})
export class SignerFacadeService {

  constructor(private iamService: IamService) {
  }

  getDid() {
    return this.iamService.signerService.did;
  }
}
