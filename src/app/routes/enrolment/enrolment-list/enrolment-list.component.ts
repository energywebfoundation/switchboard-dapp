import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { ToastrService } from 'ngx-toastr';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';

export const EnrolmentListType = {
  ISSUER: 'issuer',
  APPLICANT: 'applicant',
  ASSET: 'asset'
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
  @Input('rejected') rejected   : boolean;
  @Input('subject') subject     : string;

  @ViewChild(MatSort, undefined) sort: MatSort;

  ListType        = EnrolmentListType;
  dataSource      = new MatTableDataSource([]);
  displayedColumns: string[];
  dynamicAccepted : boolean;
  dynamicRejected : boolean;

  constructor(private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private notifService: NotificationService) {}

  async ngOnInit() { 

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'status') {
        if (item.isAccepted) {
          if (item.isSynced) {
            return 'approved';
          }
          else {
            return 'approved pending sync';
          }
        }
        else {
          if (item.isRejected) {
            return 'rejected';
          }
          else {
            return 'pending';
          }
        }
      }
      else {
        return item[property];
      }
    };

    if (this.listType === EnrolmentListType.APPLICANT || this.listType === EnrolmentListType.ASSET) {
      this.displayedColumns = ['requestDate', 'roleName', 'parentNamespace', 'status', 'actions'];
    }
    else {
      this.displayedColumns = ['requestDate', 'roleName', 'parentNamespace', 'requester', 'asset', 'status', 'actions'];
    }

    await this.getList(this.rejected, this.accepted);
  }

  private _getRejectedOnly(isRejected: boolean, isAccepted: boolean | undefined, list: any[]) {
    if (list.length && isRejected) {
      list = list.filter(item => item.isRejected === true);
    }
    else if (isAccepted === false) {
      list = list.filter(item => (item.isAccepted === false && !item.isRejected));
    }
    return list;
  }

  public async getList(isRejected: boolean, isAccepted?: boolean) {
    this.loadingService.show();
    this.dynamicRejected = isRejected;
    this.dynamicAccepted = isAccepted;
    let list = [];
    
    try {
      if (this.listType === EnrolmentListType.ASSET) {
        list = this._getRejectedOnly(isRejected, isAccepted, await this.iamService.iam.getClaimsBySubject({
          did: this.subject,
          isAccepted: isAccepted
        }));
      }
      else if (this.listType === EnrolmentListType.ISSUER) {
        list = this._getRejectedOnly(isRejected, isAccepted, await this.iamService.iam.getClaimsByIssuer({
          did: this.iamService.iam.getDid(),
          isAccepted: isAccepted
        }));
      }
      else {
        list = this._getRejectedOnly(isRejected, isAccepted, await this.iamService.iam.getClaimsByRequester({
          did: this.iamService.iam.getDid(),
          isAccepted: isAccepted
        }));
      }
      
      if (list && list.length) {
        for (let item of list) {
          let arr = item.claimType.split(`.${ENSNamespaceTypes.Roles}.`);
          item.roleName = arr[0];
          item.requestDate = new Date(item.createdAt);
        }

        if (this.listType !== EnrolmentListType.ISSUER) {
          await this.appendDidDocSyncStatus(list);
        }
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e, TOASTR_HEADER);
    }

    this.dataSource.data = list;
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
        return false;
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
    // console.log('view element', element);

    const dialogRef = this.dialog.open(ViewRequestsComponent, {
      width: '600px',data:{
        listType: this.listType,
        claimData: element
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((reloadList: any) => {
      if (reloadList) {
        this.getList(this.dynamicRejected, this.dynamicAccepted);
      }
    });
  }

  async addToDidDoc (element: any) {
    // console.log('claimToSync', element);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
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
    this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);

    try {
      let decoded: any = await this.iamService.iam.decodeJWTToken({
        token: element.issuedToken
      });

      let retVal = await this.iamService.iam.publishPublicClaim({
        token: element.issuedToken
      });

      // console.log('Publish Public Claim Result: ', retVal);
      if (retVal) {
        this.notifService.decreasePendingDidDocSyncCount();
        this.toastr.success('Action is successful.', 'Sync to DID Document');
        await this.getList(this.rejected, this.accepted);
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

  async cancelClaimRequest(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: TOASTR_HEADER,
        message: 'Are you sure to cancel this enrolment request?'
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();

    if (await dialogRef) {
      this.loadingService.show();

      try {
        await this.iamService.iam.deleteClaim({
          id: element.id
        });
        this.toastr.success('Action is successful.', 'Cancel Enrolment Request');
      }
      catch (e) {
        console.error(e);
        this.toastr.error('Failed to cancel the enrolment request.', TOASTR_HEADER)
      }
      finally {
        this.loadingService.hide();
      }
    }
  }
}
