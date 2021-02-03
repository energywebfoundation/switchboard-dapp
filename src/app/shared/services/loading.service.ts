import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading: BehaviorSubject<Number>;
  private _counter = 0;
  private _msg: BehaviorSubject<any>;
  private _isCancellable: BehaviorSubject<boolean>;

  constructor() {
    this._isLoading = new BehaviorSubject<Number>(this._counter);
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
  show(msg?: any, cancellable?: boolean) {
    if (msg) {
      this._msg.next(msg);
    }
    if (cancellable) {
      this._isCancellable.next(true);
    }
    else {
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
}
