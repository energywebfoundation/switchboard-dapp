/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CancelButton } from '../../../layout/loading/loading.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { EnrolmentForm } from '../../registration/enrolment-form/enrolment-form.component';
import { KeyValue } from '@angular/common';
import { EnrolmentClaim } from '../models/enrolment-claim.interface';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { IRoleDefinition } from 'iam-client-lib';

const TOASTR_HEADER = 'Enrolment Request';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss'],
})
export class ViewRequestsComponent implements OnInit {
  @ViewChild('issuerFields', { static: false }) requiredFields: EnrolmentForm;
  listType: EnrolmentListType;
  claim: EnrolmentClaim;
  requestorFields: KeyValue<string, string | number>[] = [];
  issuerFields: KeyValue<string, string | number>[] = [];
  userDid$ = this.store.select(userSelectors.getDid);
  fieldList = [];

  constructor(
    public dialogRef: MatDialogRef<ViewRequestsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { claimData: EnrolmentClaim; listType: EnrolmentListType },
    public dialog: MatDialog,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService,
    private store: Store<UserClaimState>,
    private notifService: NotificationService,
    private claimFacade: ClaimsFacadeService
  ) {}

  canAccept() {
    return (
      this.listType === EnrolmentListType.ISSUER &&
      !this.claim?.isAccepted &&
      !this.claim?.isRejected
    );
  }

  get isApproveDisabled() {
    return Boolean(
      !this?.requiredFields?.isValid() && this.roleContainRequiredParams()
    );
  }

  roleContainRequiredParams() {
    return this.fieldList.length > 0;
  }

  async ngOnInit() {
    this.listType = this.data.listType;
    this.claim = this.data.claimData;
    await this.getRoleIssuerFields(this.claim.claimType);
    if (this.claim) {
      await this.setIssuerFields();
      await this.setRequestorFields();
    }
  }

  async approve() {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    try {
      const req = {
        requester: this.claim.requester,
        id: this.claim.id,
        token: this.claim.token,
        subjectAgreement: this.claim.subjectAgreement,
        registrationTypes: this.claim.registrationTypes,
        issuerFields: this.requiredFields?.fieldsData() || [],
        publishOnChain: false,
      };

      await this.iamService.claimsService.issueClaimRequest(req);

      this.notifService.updatePendingApprovalList();
      this.toastr.success('Request is approved.', TOASTR_HEADER);
      this.dialogRef.close(true);
    } catch (e) {
      this.toastr.error(e?.message, TOASTR_HEADER);
    } finally {
      this.loadingService.hide();
    }
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
            this.notifService.updatePendingApprovalList();
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

  isRevocable() {
    return (
      this.claim.isAccepted &&
      this.claim.isSynced &&
      !this.claim.isRevoked &&
      this.listType === EnrolmentListType.ISSUER
    );
  }

  revoke() {
    this.claimFacade.revoke(this.claim).subscribe((result) => {
      this.dialogRef.close(result);
    });
  }

  private async getRoleIssuerFields(namespace: string) {
    this.loadingService.show();
    const definitions = await this.iamService.getRolesDefinition([
      namespace,
    ]);
    const issuerFieldList = definitions[namespace]?.issuerFields;
    if (
      issuerFieldList &&
      Array.isArray(issuerFieldList) &&
      issuerFieldList.length > 0
    ) {
      this.fieldList = issuerFieldList;
    }
    this.loadingService.hide();
  }

  private async setIssuerFields() {
    if (this.claim.issuedToken) {
      const decoded = await this.decode(this.claim.issuedToken);
      if (decoded.claimData) {
        this.issuerFields = decoded.claimData?.issuerFields
          ? decoded.claimData?.issuerFields
          : [];
      }
    }
  }

  private async setRequestorFields() {
    if (this.claim.token) {
      const decoded = await this.decode(this.claim.token);
      if (decoded.claimData) {
        this.requestorFields = this.getRequestorFields(decoded.claimData);
      }
    }
  }

  private getRequestorFields(data: {
    requestorFields?: KeyValue<string, string | number>[];
    fields?: KeyValue<string, string | number>[];
  }): KeyValue<string, string | number>[] {
    if (data?.requestorFields) {
      return data.requestorFields;
    }

    if (data?.fields) {
      return data.fields;
    }

    return [];
  }

  private async decode(token): Promise<any> {
    return await this.iamService.didRegistry.decodeJWTToken({
      token,
    });
  }
}
