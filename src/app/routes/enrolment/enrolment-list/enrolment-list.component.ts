import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
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
    private toastr: ToastrService,
    private notifService: NotificationService) {}

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

        if (this.listType === EnrolmentListType.APPLICANT) {
          await this.appendDidDocSyncStatus(list);
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

  private async appendDidDocSyncStatus(list: any[]) {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    let claims: any[] = await this.iamService.iam.getUserClaims();
    claims = claims.filter((item: any) => {
        if (item && item.claimType) {
            let arr = item.claimType.split('.');
            if (arr.length > 1 && arr[1] === ENSNamespaceTypes.Roles) {
                return true;
            }
            return false;
        }
    });

    if (claims && claims.length) {
      claims.forEach((item: any) => {
        for (let i = 0; i < list.length; i++) {
          if (item.claimType === list[i].claimType) {
            list[i].isSynced = true;
          }
        }
      });
    }
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

  async addToDidDoc (element: any) {
    console.log('claimToSync', element);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '180px',
      data: {
        header: TOASTR_HEADER,
        message: 'This role will be added to your DID Document. Do you wish to continue?'
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();

    if (await dialogRef) {
      this.syncClaimToDidDoc(element);
    }
  }

  private async syncClaimToDidDoc(element: any) {
    this.loadingService.show('Please confirm this transaction in your connected wallet.');

    try {
      let decoded: any = await this.iamService.iam.decodeJWTToken({
        token: element.issuedToken
      });

      console.log('decoded', decoded);

      let retVal = await this.iamService.iam.publishPublicClaim({
        token: element.issuedToken
      });

      console.log('Publish Public Claim Result: ', retVal);
      if (retVal) {
        element.isSynced = true;
        this.notifService.decreasePendingDidDocSyncCount();
        this.toastr.success('Action is successful.', 'Sync to DID Document');
      }
      else {
        this.toastr.warning('Unable to proceed with this action. Please contact system administrator.', 'Sync to DID Document');
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e, 'Sync to DID Document');
    }

    this.loadingService.hide();
  }
}
