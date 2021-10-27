import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DidBookHttpService } from './did-book-http.service';

export interface DidBookRecord {
  label: string;
  did: string;
  uuid: string;
  created_at: string;
}

@Injectable()
export class DidBookService {
  private list = new BehaviorSubject([]);

  constructor(private httpDodBook: DidBookHttpService) {
    this.getList();
  }

  get list$(): Observable<DidBookRecord[]> {
    return this.list.asObservable();
  }

  getList(): void {
    this.httpDodBook.getList().subscribe((list) => this.list.next(list));
  }

  add(record: Partial<DidBookRecord>) {
    this.list.next([...this.list.value, record]);
  }

  delete(uuid: string) {
  }
}
