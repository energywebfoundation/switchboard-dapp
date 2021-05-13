import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-offered-to',
  templateUrl: './offered-to.component.html',
  styleUrls: ['./offered-to.component.scss'],
  host: {
    'class': 'mat-tab-body',
  }
})
export class OfferedToComponent implements OnInit {
  @HostBinding('class') classAttr = 'row mx-0 mt-1';
  constructor() { }

  ngOnInit(): void {
    console.log('OfferedToComponent ngOnInit');
  }

}
