import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';

export const EnrolmentListType = {
  ISSUER: 'issuer',
  APPLICANT: 'applicant'
};

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-enrolment-list',
  templateUrl: './enrolment-list.component.html',
  styleUrls: ['./enrolment-list.component.scss']
})
export class EnrolmentListComponent implements OnInit {
  @Input('list-type') listType  : string;
  @Input('accepted') accepted   : boolean;

  ListType        = EnrolmentListType;
  dataSource      = [];
  displayedColumns: string[];
  dynamicAccepted : boolean;

  constructor(private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: ToastrService) {}

  async ngOnInit() { 
    if (this.listType === EnrolmentListType.APPLICANT) {
      this.displayedColumns = ['requestDate', 'name', 'namespace', 'status', 'actions'];
    }
    else {
      this.displayedColumns = ['requestDate', 'name', 'namespace', 'requestor', 'status', 'actions'];
    }

    await this.getList(this.accepted);
  }

  public async getList(isAccepted?: boolean) {
    console.log(this.listType, 'isAccepted', isAccepted);
    this.loadingService.show();
    this.dynamicAccepted = isAccepted;
    let list = [];
    
    try {
      if (this.listType === EnrolmentListType.ISSUER) {
        list = await this.iamService.iam.getIssuedClaims({
          did: this.iamService.iam.getDid(),
          isAccepted: isAccepted
        });
      }
      else {
        list = await this.iamService.iam.getRequestedClaims({
          did: this.iamService.iam.getDid(),
          isAccepted: isAccepted
        });
      }
      
      if (list && list.length) {
        for (let item of list) {
          let arr = item.claimType.split(`.${ENSNamespaceTypes.Roles}.`);
          item.roleName = arr[0];
          item.requestDate = new Date(parseInt(item.createdAt));
        }
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e, TOASTR_HEADER);
    }

    console.log(this.listType, 'list', list);
    this.dataSource = list;
    this.loadingService.hide();
  }

  view (element: any) {
    console.log('view element', element);

    const dialogRef = this.dialog.open(ViewRequestsComponent, {
      width: '600px',data:{
        listType: this.listType,
        claimData: element
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((reloadList: any) => {
      if (reloadList) {
        this.getList(this.dynamicAccepted);
      }
    });
  }
}
