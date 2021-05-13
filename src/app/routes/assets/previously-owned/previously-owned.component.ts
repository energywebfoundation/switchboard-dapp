import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-previously-owned',
  templateUrl: './previously-owned.component.html',
  styleUrls: ['./previously-owned.component.scss'],
  host: {
    'class': 'mat-tab-body',
  }
})
export class PreviouslyOwnedComponent implements OnInit {
  @HostBinding('class') classAttr = 'row mx-0 mt-1';
  constructor() { }

  ngOnInit(): void {
    console.log('OwnedComponent PreviouslyOwnedComponent');
  }

}
