import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading: BehaviorSubject<Number>;
  private _counter = 0;

  constructor() {
    this._isLoading = new BehaviorSubject<Number>(this._counter);
  }

  get isLoading() {
    return this._isLoading.asObservable();
  }

  show() {
    this._isLoading.next(++this._counter);
  }

  hide() {
    if (--this._counter < 0) {
      this._counter = 0;
    }
    this._isLoading.next(this._counter);
  }
}
