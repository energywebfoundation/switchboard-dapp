import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DidBookService } from '../../services/did-book.service';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-did-book',
  templateUrl: './did-book.component.html',
  styleUrls: ['./did-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidBookComponent implements OnInit {
  list$;
  filter = new FormControl('');

  constructor(private didBookService: DidBookService) {
  }

  ngOnInit(): void {
    this.list$ = combineLatest([this.didBookService.getList$(), this.filter.valueChanges.pipe(startWith(''))])
      .pipe(map(([list, value]) =>
        list.filter(el => el.label.toLowerCase().includes(value.toLowerCase()))
      ));
  }

  addHandler(record) {
    this.didBookService.add(record);
  }

  delete(id: string) {
    this.didBookService.delete(id);
  }

}
