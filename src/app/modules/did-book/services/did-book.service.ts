import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DidBookRecord {
  label: string;
  did: string;
  uuid: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DidBookService {
  constructor() {
  }

  getList(): Observable<DidBookRecord[]> {
    return of([]);
  }

  add(record: Partial<DidBookRecord>) {

  }

  delete(uuid: string) {

  }
}
