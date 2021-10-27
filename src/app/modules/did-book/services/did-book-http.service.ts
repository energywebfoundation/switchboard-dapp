import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DidBookHttpService {

  constructor(private http: HttpClient) {
  }

  getList() {
    return of([
      {
        label: 'asd',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      }, {
        label: 'asd1',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      }, {
        label: 'asd2',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      }, {
        label: 'asd3',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      }, {
        label: 'asd4',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      }, {
        label: 'asd5',
        did: 'did:ethr:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'
      },
    ]);
  }

  delete(uuid: string) {

  }

  add(record) {

  }
}
