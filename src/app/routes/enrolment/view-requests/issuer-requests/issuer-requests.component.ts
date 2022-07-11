import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { EnrolmentForm } from '../../../registration/enrolment-form/enrolment-form.component';
import { EnrolmentListType } from '../../enrolment-list/models/enrolment-list-type.enum';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { KeyValue } from '@angular/common';
import * as userSelectors from '../../../../state/user-claim/user.selectors';
import { IRoleDefinitionV2 } from 'iam-client-lib';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IamService } from '../../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../../state/user-claim/user.reducer';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CancelButton } from '../../../../layout/loading/loading.component';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';
import { TokenDecodeService } from '../services/token-decode.service';
import { EnrolmentDetailsRequestsService } from '../services/enrolment-details-requests.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const TOASTR_HEADER = 'Enrolment Request';

@Component({
  selector: 'app-issuer-requests',
  templateUrl: './issuer-requests.component.html',
  styleUrls: ['./issuer-requests.component.scss'],
})
export class IssuerRequestsComponent implements OnInit {
  @ViewChild('issuerFields', { static: false }) requiredFields: EnrolmentForm;
  requestorFields: KeyValue<string, string | number>[] = [];
  issuerFields: KeyValue<string, string | number>[] = [];
  userDid$ = this.store.select(userSelectors.getDid);
  fieldList = [];
  roleDefinition: IRoleDefinitionV2;

  constructor(
    public dialogRef: MatDialogRef<IssuerRequestsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { claimData: EnrolmentClaim },
    public dialog: MatDialog,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService,
    private store: Store<UserClaimState>,
    private tokenDecodeService: TokenDecodeService,
    private enrolmentDetailsRequests: EnrolmentDetailsRequestsService
  ) {}

  canAccept() {
    return (
      !this.claim?.isAccepted &&
      !this.claim?.isRejected &&
      !this.claim.isRevoked
    );
  }

  get claim() {
    return this.data.claimData;
  }

  get isApproveDisabled() {
    return Boolean(
      !this?.requiredFields?.isValid() && this.roleContainRequiredParams()
    );
  }

  roleContainRequiredParams() {
    return this.fieldList.length > 0;
  }

  ngOnInit() {
    this.getRoleIssuerFields(this.claim.claimType);
    if (this.claim) {
      this.setIssuerFields();
      this.setRequestorFields();
    }
  }

  private setIssuerFields() {
    if (!this.claim.issuedToken) {
      return;
    }
    this.tokenDecodeService
      .getIssuerFields(this.claim.issuedToken)
      .subscribe((fields) => (this.issuerFields = fields));
  }

  private setRequestorFields() {
    if (!this.claim.token) {
      return;
    }
    this.tokenDecodeService
      .getRequestorFields(this.claim?.token)
      .subscribe((fields) => (this.requestorFields = fields));
  }

  async approve() {
    this.enrolmentDetailsRequests
      .approve(this.claim, this.requiredFields?.fieldsData() || [])
      .pipe(
        map(() => {
          this.toastr.success('Request is approved.', TOASTR_HEADER);
          this.dialogRef.close(true);
        }),
        catchError((err) => {
          this.toastr.error(err?.message, TOASTR_HEADER);
          return of(err);
        })
      );
  }

  reject() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: TOASTR_HEADER,
          message: 'Are you sure to reject this request?',
          isDiscardButton: false,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res) {
          this.loadingService.show();
          try {
            await this.iamService.claimsService.rejectClaimRequest({
              id: this.claim.id,
              requesterDID: this.claim.requester,
            });
            this.toastr.success(
              'Request is rejected successfully.',
              TOASTR_HEADER
            );
            this.dialogRef.close(true);
          } catch (e) {
            console.error(e);
          } finally {
            this.loadingService.hide();
          }
        }
      });
  }

  revokeSuccessHandler() {
    this.dialogRef.close(true);
  }

  private getRoleIssuerFields(namespace: string): void {
    this.enrolmentDetailsRequests
      .getRoleIssuerFields(namespace)
      .subscribe((definitions) => {
        this.roleDefinition = definitions;
        const issuerFieldList = definitions[namespace]?.issuerFields;
        if (
          issuerFieldList &&
          Array.isArray(issuerFieldList) &&
          issuerFieldList.length > 0
        ) {
          this.fieldList = issuerFieldList;
        }
      });
  }
}
