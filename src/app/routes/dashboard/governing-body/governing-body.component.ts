import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../../registration/registration.service';

const swal = require('sweetalert');
enum IOrgType {
  ASSET_OWNER = 'ORG_TYPE::ASSET_OWNER', TSO = 'ORG_TYPE::TSO', DSO = 'ORG_TYPE::DSO', INSTALLER = 'ORG_TYPE::INSTALLER'
}

@Component({
  selector: 'app-governing-body',
  templateUrl: './governing-body.component.html',
  styleUrls: ['./governing-body.component.scss']
})
export class GoverningBodyComponent implements OnInit {
  displayedColumns: string[] = ['type', 'name', , 'email', 'address', 'status', 'actionButton'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private registrationService: RegistrationService,
    public dialog: MatDialog, 
    public http: HttpClient    
  ) {    
    
  }

  
  ngOnInit() {
    this.registrationService.retriveIdentities().then(result => {
      swal(result);
    })
    .catch(error => {
      swal(error);
    });
  }

  onRemove() {
    swal("Organization Removed", "", "success");
  }

  
  openDialogHistory(): void {
    const dialogRef = this.dialog.open(DialogHistory, {
      width: '780px', data: {},
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

export interface DialogData {
  approved: string;
  removed: string;
  rejected: string;
}

@Component({
  selector: 'dialog-history',
  templateUrl: 'dialog-history.html',
  styleUrls: ['./governing-body.component.scss']
})


export class DialogHistory {
  constructor(
    public dialogRef: MatDialogRef<DialogHistory>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
