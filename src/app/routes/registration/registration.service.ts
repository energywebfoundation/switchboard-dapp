import { Injectable, Inject } from '@angular/core';
import { abi } from '../../shared/services/contract-artifacts/IdentityRegistry.json';
import { environment } from '../../../environments/environment';
import async from 'async';

const { IDENTITY_CONTRACT_ADDRESS } = environment;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {  

  constructor() { 
  }

  public registerUser(userInfo: any): any {
     
  }

  public retriveIdentities(): any {
     
  }
}
