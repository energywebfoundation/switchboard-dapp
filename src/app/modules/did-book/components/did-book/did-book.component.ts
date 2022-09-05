import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { DidBookService } from '../../services/did-book.service';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { DidBookRecord } from '../models/did-book-record';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-did-book',
  templateUrl: './did-book.component.html',
  styleUrls: ['./did-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidBookComponent implements OnInit {
  list$: Observable<DidBookRecord[]>;
  filter = new FormControl('');

  get did(): string {
    return this?.data?.did;
  }

  get label(): string {
    return this?.data?.label;
  }

  constructor(
    private didBookService: DidBookService,
    @Inject(MAT_DIALOG_DATA) private data: Partial<DidBookRecord>
  ) {}

  ngOnInit(): void {
    this.setUpFilter();
  }

  addHandler(record: Partial<DidBookRecord>): void {
    this.didBookService.add(record);
  }

  delete(id: string): void {
    this.didBookService.delete(id);
  }

  private setUpFilter(): void {
    this.list$ = combineLatest([
      this.didBookService.getList$(),
      this.filter.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([list, value]) =>
        list.filter((el) =>
          el.label.toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  }

  get didList$() {
    return this.didBookService.getDIDList$();
  }
}
