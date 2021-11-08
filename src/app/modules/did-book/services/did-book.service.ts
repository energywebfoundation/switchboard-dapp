import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DidBookHttpService } from './did-book-http.service';
import { DidBookRecord } from '../components/models/did-book-record';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

const TOASTR_HEADER = 'DID Book';

@Injectable()
export class DidBookService {
  private list = new BehaviorSubject([]);

  constructor(private httpDidBook: DidBookHttpService,
              private toastr: SwitchboardToastrService) {
  }

  get list$(): Observable<DidBookRecord[]> {
    return this.list.asObservable();
  }

  getList(): void {
    this.httpDidBook.getList().subscribe((list: DidBookRecord[]) => this.list.next(list));
  }

  add(record: Partial<DidBookRecord>) {
    this.httpDidBook.add(record).subscribe((newRecord: DidBookRecord) => {
        this.list.next([...this.list.value, newRecord]);
        this.toastr.success('New DID Address has been added', TOASTR_HEADER);
      },
      error => this.toastr.error(error.message));
  }

  delete(id: string) {
    this.httpDidBook.delete(id).subscribe(() => {
        this.list.next(this.removeFromList(id));
        this.toastr.success('DID Address has been successfully removed', TOASTR_HEADER);
      },
      error => this.toastr.error(error.message)
    );
  }

  private removeFromList(id) {
    return this.list.value.filter((el) => el.id !== id);
  }
}
