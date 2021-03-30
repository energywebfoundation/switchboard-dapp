import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
// import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  displayedColumns: string[] = ['logo', 'name', 'activeEnrolments', 'type', 'status', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }
  // constructor(public dialog: MatDialog) { }

  // regPassiveAsset() {
  //   const dialogRef = this.dialog.open(NewPassiveAssetComponent, {
  //     width: '600px',data:{},
  //     maxWidth: '100%',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  ngOnInit(): void {
  }

}
// @Component({
//   selector: 'app-new-passive-asset',
//   templateUrl: './new-passive-asset/new-passive-asset.component.html'
// })

// export class newPassiveAsset {}

export interface PeriodicElement {
  logo: string;
  name: string;
  activeEnrolments: string;
  type: string;
  status: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {logo: '', name: 'macbook2019Q1.support.apple.iam.ewc', activeEnrolments: 'IoT Gateway', type: 'Passive', status: 'Online', actions: ''},
  {logo: '', name: 'Living Room Gateway', activeEnrolments: 'IoT Gateway', type: 'Active', status: 'Online', actions: ''},
  {logo: '', name: 'Apartment Smart Gateway', activeEnrolments: 'IoT Gateway', type: 'Active', status: 'Online', actions: ''},
];
