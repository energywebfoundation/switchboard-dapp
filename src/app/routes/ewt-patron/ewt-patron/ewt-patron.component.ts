import { Component, OnInit } from '@angular/core';
import { PatronService } from '../patron.service';


@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit {
  balance$ = this.patronService.balance$;

  constructor(private patronService: PatronService) {
  }

  ngOnInit() {
    this.patronService.init();
  }

}
