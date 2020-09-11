import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public dialog: MatDialog ) { }

  openDialogProfile(): void {
    const dialogRef = this.dialog.open(DialogProfile, {
      width: '415px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

export interface DialogData {
  scanQR: string;
}

@Component({
  selector: 'dialog-profile',
  templateUrl: 'dialog-profile.html',
  styleUrls: ['./profile.component.scss']
})

export class DialogProfile {
  constructor(
    public dialogRef: MatDialogRef<DialogProfile>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  } 
}

