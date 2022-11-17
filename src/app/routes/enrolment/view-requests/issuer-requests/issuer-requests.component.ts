import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { EnrolmentForm } from '../../../registration/enrolment-form/enrolment-form.component';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IRoleDefinitionV2 } from 'iam-client-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenDecodeService } from '../services/token-decode.service';
import { IssuerRequestsService } from '../services/issuer-requests.service';
import { RoleService } from '../../../../state/governance/role/services/role.service';
import { ViewRequestsComponent } from '../view-requests.component';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';

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
  roleDefinition: IRoleDefinitionV2;
  expirationTime: number;

  constructor(
    private dialogRef: MatDialogRef<IssuerRequestsComponent>,
    private issuerRequestsService: IssuerRequestsService,
    private roleService: RoleService,
    tokenDecodeService: TokenDecodeService,
    @Inject(MAT_DIALOG_DATA)
    data: { claimData: EnrolmentClaim }
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

  get fieldList(): IFieldDefinition[] {
    return this.roleDefinition?.issuerFields ?? [];
  }

  get isApproveDisabled(): boolean {
    return Boolean(
      !this?.requiredFields?.isValid() && this.roleContainRequiredParams()
    );
  }

  roleContainRequiredParams(): boolean {
    return this.fieldList.length > 0;
  }

  ngOnInit() {
    this.getRoleIssuerFields(this.claim.claimType);
  }

  approve(): void {
    this.issuerRequestsService
      .approve(
        this.claim,
        this.requiredFields?.fieldsData() || [],
        this.expirationTime
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  reject(): void {
    this.issuerRequestsService.reject(this.claim).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  revokeSuccessHandler(): void {
    this.dialogRef.close(true);
  }

  setExpirationTimeUsingValidity(validityPeriod: number): void {
    this.expirationTime = Date.now() + validityPeriod;
  }

  clearExpirationDate(): void {
    this.expirationTime = undefined;
  }

  private getRoleIssuerFields(namespace: string): void {
    this.roleService
      .getDefinition(namespace)
      .subscribe((definitions: IRoleDefinitionV2) => {
        this.roleDefinition = definitions;
        this.expirationTime = this.roleDefinition?.defaultValidityPeriod
          ? Date.now() + this.roleDefinition?.defaultValidityPeriod
          : undefined;
      });
  }
}
