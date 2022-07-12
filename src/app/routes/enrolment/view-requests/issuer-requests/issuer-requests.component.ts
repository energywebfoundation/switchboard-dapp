import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { EnrolmentForm } from '../../../registration/enrolment-form/enrolment-form.component';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import * as userSelectors from '../../../../state/user-claim/user.selectors';
import { IRoleDefinitionV2 } from 'iam-client-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../../state/user-claim/user.reducer';
import { TokenDecodeService } from '../services/token-decode.service';
import { IssuerRequestsService } from '../services/issuer-requests.service';
import { RoleService } from '../../../../state/governance/role/services/role.service';
import { ViewRequestsComponent } from '../view-requests.component';

@Component({
  selector: 'app-issuer-requests',
  templateUrl: './issuer-requests.component.html',
  styleUrls: ['./issuer-requests.component.scss'],
})
export class IssuerRequestsComponent
  extends ViewRequestsComponent
  implements OnInit
{
  @ViewChild('issuerFields', { static: false }) requiredFields: EnrolmentForm;
  userDid$ = this.store.select(userSelectors.getDid);
  roleDefinition: IRoleDefinitionV2;

  constructor(
    public dialogRef: MatDialogRef<IssuerRequestsComponent>,
    private store: Store<UserClaimState>,
    private issuerRequestsService: IssuerRequestsService,
    private roleService: RoleService,
    tokenDecodeService: TokenDecodeService,
    @Inject(MAT_DIALOG_DATA) data: { claimData: EnrolmentClaim }
  ) {
    super(data, tokenDecodeService);
  }

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
