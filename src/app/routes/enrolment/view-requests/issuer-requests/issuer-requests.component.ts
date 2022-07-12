import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { EnrolmentForm } from '../../../registration/enrolment-form/enrolment-form.component';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { KeyValue } from '@angular/common';
import * as userSelectors from '../../../../state/user-claim/user.selectors';
import { IRoleDefinitionV2 } from 'iam-client-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../../state/user-claim/user.reducer';
import { TokenDecodeService } from '../services/token-decode.service';
import { IssuerRequestsService } from '../services/issuer-requests.service';
import { Observable } from 'rxjs';
import { RoleService } from '../../../../state/governance/role/services/role.service';

@Component({
  selector: 'app-issuer-requests',
  templateUrl: './issuer-requests.component.html',
  styleUrls: ['./issuer-requests.component.scss'],
})
export class IssuerRequestsComponent implements OnInit {
  @ViewChild('issuerFields', { static: false }) requiredFields: EnrolmentForm;
  requestorFields$: Observable<KeyValue<string, string | number>[]> =
    this.tokenDecodeService.getRequestorFields(this.claim?.token);
  issuerFields$: Observable<KeyValue<string, string | number>[]> =
    this.tokenDecodeService.getIssuerFields(this.claim?.issuedToken);
  userDid$ = this.store.select(userSelectors.getDid);
  roleDefinition: IRoleDefinitionV2;

  constructor(
    public dialogRef: MatDialogRef<IssuerRequestsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { claimData: EnrolmentClaim },
    private store: Store<UserClaimState>,
    private tokenDecodeService: TokenDecodeService,
    private issuerRequestsService: IssuerRequestsService,
    private roleService: RoleService
  ) {}

  canAccept() {
    return (
      !this.claim?.isAccepted &&
      !this.claim?.isRejected &&
      !this.claim.isRevoked
    );
  }

  get fieldList() {
    return this.roleDefinition?.issuerFields ?? [];
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
  }

  approve(): void {
    this.issuerRequestsService
      .approve(this.claim, this.requiredFields?.fieldsData() || [])
      .subscribe(() => this.dialogRef.close(true));
  }

  reject(): void {
    this.issuerRequestsService.reject(this.claim).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  revokeSuccessHandler() {
    this.dialogRef.close(true);
  }

  private getRoleIssuerFields(namespace: string): void {
    this.roleService
      .getDefinition(namespace)
      .subscribe((definitions) => (this.roleDefinition = definitions));
  }
}
