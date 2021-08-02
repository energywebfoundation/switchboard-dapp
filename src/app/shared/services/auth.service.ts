import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {

  // public roles: Array<string>;
  constructor(private http: HttpClient) {
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }


  /**
   * Logout the user
   */
  public logout() {
    const promise = new Promise( (resolve, reject) => {
      try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('EW-DID-CONFIG');
        resolve();
      } catch (e) {
        reject();
      }
    });
    return promise;
  }

  public getUserId(): string {
    return JSON.parse(localStorage.getItem('currentUser')).id;
  }

  public getDID(): string {
    return '';
  }

  public getRoles(): Array<string> {
    return [JSON.parse(localStorage.getItem('currentUser')).organizationType];
  }

  public isOwner(): boolean {
    return JSON.parse(localStorage.getItem('currentUser')).organizationType === 'Asset-owner';
  }

  public isDSO(): boolean {
    return JSON.parse(localStorage.getItem('currentUser')).organizationType === 'DSO';
  }

  public isTSO(): boolean {
    return JSON.parse(localStorage.getItem('currentUser')).organizationType === 'TSO';
  }

  public setUser(user: any) {
    const promise = new Promise( (resolve, reject) => {
      try {
        // console.log(JSON.parse(user).organizationType);
        // this.roles = [JSON.parse(user).organizationType];
        localStorage.setItem('currentUser', user);
        resolve();
      } catch (e) {
        reject();
      }
    });
    return promise;
  }


}

