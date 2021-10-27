import { Component, OnInit } from '@angular/core';
import { DidBookService } from '../../services/did-book.service';

@Component({
  selector: 'app-did-book',
  templateUrl: './did-book.component.html',
  styleUrls: ['./did-book.component.scss']
})
export class DidBookComponent implements OnInit {

  list$ = this.didBookService.getList();

  constructor(private didBookService: DidBookService) {
  }

  ngOnInit(): void {
  }

}
