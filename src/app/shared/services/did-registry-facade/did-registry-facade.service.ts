import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';

@Injectable({
  providedIn: 'root',
})
export class DidRegistryFacadeService {
  constructor(private iamService: IamService) {}

  updateDocument(data) {
    return this.iamService.didRegistry.updateDocument(data);
  }

  getDidDocument(data) {
    return this.iamService.didRegistry.getDidDocument(data);
  }
}
