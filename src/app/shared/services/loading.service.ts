/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LoadingCount } from '../constants/shared-constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading: BehaviorSubject<number>;
  private _counter = 0;
  private _msg: BehaviorSubject<any>;
  private _isCancellable: BehaviorSubject<boolean>;

  constructor() {
    this._isLoading = new BehaviorSubject<number>(this._counter);
    this._msg = new BehaviorSubject<any>('');
    this._isCancellable = new BehaviorSubject<any>(false);
  }

  get isLoading() {
    return this._isLoading.asObservable();
  }

  get message() {
    return this._msg.asObservable();
  }

  get isCancellable() {
    return this._isCancellable.asObservable();
  }

  // adding timeout wil cause endless loading when this.hide() was called earlier then 100ms after this.show()
  show(msg?: string, cancellable?: boolean) {
    if (msg) {
      this._msg.next(msg);
    }
    if (cancellable) {
      this._isCancellable.next(true);
    } else {
      this._isCancellable.next(false);
    }
    this._isLoading.next(++this._counter);
  }

  hide() {
    if (--this._counter < 0) {
      this._counter = 0;
    }
    this._msg.next('');
    this._isLoading.next(this._counter);
  }

  updateLocalLoadingFlag(
    loadingObj: { requests: any[]; value: boolean },
    method: LoadingCount
  ) {
    if (loadingObj && loadingObj.requests) {
      if (method === LoadingCount.UP) {
        loadingObj.requests.push(true);
      } else if (method === LoadingCount.DOWN) {
        loadingObj.requests.pop();
      }
      loadingObj.value = loadingObj.requests.length > 0;
    }
  }
}
