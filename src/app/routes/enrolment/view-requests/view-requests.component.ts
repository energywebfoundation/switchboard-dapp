import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CancelButton } from '../../../layout/loading/loading.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { map } from 'rxjs/operators';
import { RequiredFields } from '../../../modules/required-fields/components/required-fields/required-fields.component';

const TOASTR_HEADER = 'Enrolment Request';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss']
})
export class ViewRequestsComponent implements OnInit {
  @ViewChild('requiredFields', {static: false}) requiredFields: RequiredFields;
  listType: string;
  claim: any;
  fields = [];
  userDid$ = this.store.select(userSelectors.getDid);
  claimParams;
  fieldList = [];

  constructor(public dialogRef: MatDialogRef<ViewRequestsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private iamService: IamService,
              private toastr: SwitchboardToastrService,
              private loadingService: LoadingService,
              private store: Store<UserClaimState>,
              private notifService: NotificationService) {
  }

  canAccept() {
    return this.listType === 'issuer' && !this.claim?.isAccepted && !this.claim?.isRejected;
  }

  get isApproveDisabled() {
    return Boolean(!this?.requiredFields?.isValid() && this.roleContainRequiredParams());
  }

  roleContainRequiredParams() {
    return this.fieldList.length > 0;
  }

  async ngOnInit() {
    this.listType = this.data.listType;
    this.claim = this.data.claimData;
    this.getRoleMetadata(this.claim.claimType);
    if (this.claim && this.claim.token) {
      const decoded: any = await this.iamService.iam.decodeJWTToken({
        token: this.claim.token
      });
      if (decoded.claimData && decoded.claimData.fields) {
        this.fields = decoded.claimData.fields;
      }
    }
    await this.setClaimParams();
  }

  async approve() {
    this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
    try {
      const req = {
        requester: this.claim.requester,
        id: this.claim.id,
        token: this.claim.token,
        subjectAgreement: this.claim.subjectAgreement,
        registrationTypes: this.claim.registrationTypes,
        claimParams: this.requiredFields?.fieldsData()
      };

      await this.iamService.iam.issueClaimRequest(req);

      this.notifService.decreasePendingApprovalCount();
      this.toastr.success('Request is approved.', TOASTR_HEADER);
      this.dialogRef.close(true);
    } catch (e) {
      this.toastr.error(e, TOASTR_HEADER);
    } finally {
      this.loadingService.hide();
    }
  }

  reject() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: TOASTR_HEADER,
        message: 'Are you sure to reject this request?',
        isDiscardButton: false
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe(async (res: any) => {
      if (res) {
        this.loadingService.show();
        try {
          await this.iamService.iam.rejectClaimRequest({
            id: this.claim.id,
            requesterDID: this.claim.requester
          });
          this.notifService.decreasePendingApprovalCount();
          this.toastr.success('Request is rejected successfully.', TOASTR_HEADER);
          this.dialogRef.close(true);
        } catch (e) {
          console.error(e);
        } finally {
          this.loadingService.hide();
        }
      }
    });
  }

  private async getRoleMetadata(namespace: string) {
    const definitions: any = await this.iamService.iam.getRolesDefinition({namespaces: [namespace]});
    const requiredParams = definitions[namespace]?.metadata?.requiredParams;
    if (requiredParams && Array.isArray(requiredParams) && requiredParams.length > 0) {
      this.fieldList = requiredParams;
    }
  }

  private setClaimParams() {
    this.loadingService.show();
    this.iamService.getDidDocument({did: this.claim.subject, includeClaims: true})
      .pipe(
        map((data) => data.service.filter(obj => obj.claimParams))
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.claimParams = this.createKeyValuePair(data[0]?.claimParams);
        }
        this.loadingService.hide();
      });
  }

  private createKeyValuePair(object: Object) {
    return Object.keys(object).map(key => ({key, value: object[key]}));
  }
}
