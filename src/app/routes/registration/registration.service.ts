import { Injectable, Inject } from '@angular/core';
import { WEB3 } from '../../shared/services/web3.tokens';
import {TruffleContract} from 'truffle-contract';
import { abi } from '../../shared/services/contract-artifacts/IdentityRegistry.json';
import Web3 from 'web3';
import { environment } from '../../../environments/environment';
import async from 'async';

const { IDENTITY_CONTRACT_ADDRESS } = environment;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  public identityRegistryContract: TruffleContract;      

  constructor(@Inject(WEB3) public web3: Web3) {    
    this.identityRegistryContract = new web3.eth.Contract(abi, IDENTITY_CONTRACT_ADDRESS);
  }

  public registerUser(userInfo: any): any {
    const promise = new Promise(function (resolve, reject) {
      try {
        this.identityRegistryContract.methods.createIdentity(
          [
            userInfo.organizationType,
            userInfo.name,
            userInfo.emailAddress,
            userInfo.postalAddress,
          ]).send({
            from: this.web3.eth.accounts.currentProvider.selectedAddress
          })
          .then(reciept => {
            if (reciept){
              resolve(this.web3.eth.accounts.currentProvider.selectedAddress);
            } else {
              reject();
            }
          })
          .catch(error  => {
            reject(error);
          });          
      } catch (err) {
          reject(err);
      }
    }.bind(this));
    return promise;    
  }

  public retriveIdentities(): any {
    const promise = new Promise(function (resolve, reject) {
      let identities = [];
      try {
        this.identityRegistryContract.methods.getIdentities().call({
            from: this.web3.eth.accounts.currentProvider.selectedAddress
          })
          .then(idList => {
            async.each(idList, (id, callback) => {
              this.identityRegistryContract.methods.getIdentityById(id).call({
                from: this.web3.eth.accounts.currentProvider.selectedAddress
              })
              .then(identity => {
                identities.push({
                  did: 'did:ethr:' + id,
                  organizationType: identity[1][0],
                  name: identity[1][1],
                  emailAddress: identity[1][2],
                  postalAddress: identity[1][3]
                });
                callback()
              })
              .catch(err => {
                callback()
              });
            }, function(err) {              
                if(!err )
                resolve(identities);
            });            
          })
          .catch(error  => {
            reject(error);
          });          
      } catch (err) {
          reject(err);
      }
    }.bind(this));
    return promise;    
  }
}
