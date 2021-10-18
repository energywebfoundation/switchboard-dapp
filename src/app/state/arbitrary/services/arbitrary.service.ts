import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArbitraryService {

  constructor() {
  }

  getList() {
    return of([]);
  }
}
