import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  displayedColumns: string[] = ['qrCode', 'name', 'activeEnrolments', 'type', 'status', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  qrCode: string;
  name: string;
  activeEnrolments: string;
  type: string;
  status: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {qrCode: '', name: 'macbook2019Q1.support.apple.iam.ewc', activeEnrolments: 'IoT Gateway', type: 'Passive', status: 'Online', actions: ''},
  {qrCode: '', name: 'Living Room Gateway', activeEnrolments: 'IoT Gateway', type: 'Active', status: 'Online', actions: ''},
  {qrCode: '', name: 'Apartment Smart Gateway', activeEnrolments: 'IoT Gateway', type: 'Active', status: 'Online', actions: ''},
];
