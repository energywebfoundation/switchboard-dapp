import { Component, HostBinding, OnInit } from '@angular/core';
import { NewPassiveAssetComponent } from '../new-passive-asset/new-passive-asset.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-owned',
  templateUrl: './owned.component.html',
  styleUrls: ['./owned.component.scss'],
})
export class OwnedComponent implements OnInit {
  @HostBinding('class') classAttr = 'row mx-0 mt-1';
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('OwnedComponent ngOnInit');
  }


  registerAsset() {
    const dialogRef = this.dialog.open(NewPassiveAssetComponent, {
      width: '600px', data: {},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.listMyAssets.getAssetList(RESET_LIST);
      }
    });
  }
}
