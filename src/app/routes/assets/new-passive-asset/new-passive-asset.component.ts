import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PredefinedIconsComponent } from './predefined-icons/predefined-icons.component';


@Component({
  selector: 'app-new-passive-asset',
  templateUrl: './new-passive-asset.component.html',
  styleUrls: ['./new-passive-asset.component.scss']
})
export class NewPassiveAssetComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openPredefinedIcons() {
    const dialogRef = this.dialog.open(PredefinedIconsComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }

  closeDialog() {}
}

@Component({
  selector: 'app-predefined-icons',
  templateUrl: './predefined-icons/predefined-icons.component.html'
})

export class newPredefinedIcons {}