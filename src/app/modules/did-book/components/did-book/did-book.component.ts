import { Component, OnInit } from '@angular/core';
import { DidBookService } from '../../services/did-book.service';

@Component({
  selector: 'app-did-book',
  templateUrl: './did-book.component.html',
  styleUrls: ['./did-book.component.scss']
})
export class DidBookComponent implements OnInit {

  list$ = this.didBookService.list$;

  constructor(private didBookService: DidBookService) {
  }

  ngOnInit(): void {
  }

  addHandler(record) {
    this.didBookService.add(record);
  }

  delete(uuid: string) {
    this.didBookService.delete(uuid);
  }
}
