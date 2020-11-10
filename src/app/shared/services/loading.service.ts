import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading : BehaviorSubject<Number>;
  private _counter = 0;
  private _msg : BehaviorSubject<String>;

  constructor() {
    this._isLoading = new BehaviorSubject<Number>(this._counter);
    this._msg = new BehaviorSubject<String>('');
  }

  get isLoading() {
    return this._isLoading.asObservable();
  }

  get message() {
    return this._msg.asObservable();
  }

  show(msg?: string) {
    if (msg && msg.trim()) {
      this._msg.next(msg.trim());
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
