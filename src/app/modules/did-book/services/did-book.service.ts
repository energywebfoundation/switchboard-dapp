import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DidBookHttpService } from './did-book-http.service';
import { DidBookRecord } from '../components/models/did-book-record';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { map, tap } from 'rxjs/operators';
import { retryWhenWithDelay } from '@operators';

const TOASTR_HEADER = 'DID Book';

@Injectable({ providedIn: 'root' })
export class DidBookService {
  private list = new BehaviorSubject<DidBookRecord[]>([]);

  constructor(
    private httpDidBook: DidBookHttpService,
    private toastr: SwitchboardToastrService
  ) {}

  getList$(): Observable<DidBookRecord[]> {
    return this.list.asObservable();
  }

  getDIDList$(): Observable<string[]> {
    return this.getList$().pipe(
      map((items) => items.map((item: DidBookRecord) => item.did))
    );
  }

  getList(): void {
    this.httpDidBook
      .getList()
      .pipe(retryWhenWithDelay())
      .subscribe({
        next: (list: DidBookRecord[]) => this.list.next(list),
        error: (err) => console.log(err),
      });
  }

  add(record: Partial<DidBookRecord>) {
    this.httpDidBook.add(record).subscribe({
      next: (newRecord: DidBookRecord) => {
        this.list.next([...this.list.value, newRecord]);
        this.toastr.success('New DID Address has been added', TOASTR_HEADER);
      },
      error: (error) => this.toastr.error(error.message),
    });
  }

  delete(id: string) {
    this.httpDidBook.delete(id).subscribe({
      next: () => {
        this.list.next(this.removeFromList(id));
        this.toastr.success(
          'DID Address has been successfully removed',
          TOASTR_HEADER
        );
      },
      error: (error) => this.toastr.error(error.message),
    });
  }

  exist(did: string): boolean {
    return this.list.getValue().some((item: DidBookRecord) => item.did === did);
  }

  private removeFromList(id) {
    return this.list.value.filter((el) => el.id !== id);
  }
}
