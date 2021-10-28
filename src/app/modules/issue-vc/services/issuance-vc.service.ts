import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {

  constructor(private iamService: IamService) {
  }

  create(data: { subject: string, claim: any }) {
    this.iamService.issueClaim(data);
  }
}
