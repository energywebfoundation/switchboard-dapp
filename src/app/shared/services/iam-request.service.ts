import { Injectable } from '@angular/core';
import { ExpiredRequestError } from '../errors/errors';

@Injectable({
  providedIn: 'root'
})
export class IamRequestService {
  private _counter = 0;
  private _queue = {};

  constructor() { }

  async enqueue(request: any, params?: any[]): Promise<any> {
    let counter = ++this._counter;

    try {
      this._queue[`${counter}`] = '';

      let res = undefined;
      if (params) {
        res = await request(... params);
      }
      else {
        res = await request();
      }

      if (this._counter === counter) {
        return res;
      }
      else {
        throw new ExpiredRequestError('Expired Request');
      }
    }
    catch (e) {
      throw(e);
    }
    finally {
      delete this._queue[`${counter}`];
    }
  }
}
