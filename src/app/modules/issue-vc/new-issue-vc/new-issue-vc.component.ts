import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '@utils';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PreconditionCheck,
  preconditionCheck,
} from '../../../routes/registration/utils/precondition-check';
import { filter, switchMap } from 'rxjs/operators';
import { EnrolmentSubmission } from '../../../routes/registration/enrolment-form/enrolment-form.component';
import { IRole, IRoleDefinitionV2 } from 'iam-client-lib';
import { MatSelectChange } from '@angular/material/select/select';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';

const DEFAULT_CLAIM_TYPE_VERSION = 1;

@Component({
  selector: 'app-new-issue-vc',
  templateUrl: './new-issue-vc.component.html',
  styleUrls: ['./new-issue-vc.component.scss'],
})
export class NewIssueVcComponent implements OnInit {
  fieldList: IFieldDefinition[] = [];
  form = this.fb.group({
    subject: ['', [Validators.required, HexValidators.isDidValid()]],
    type: ['', [Validators.required]],
  });
  possibleRolesToEnrol: IRole[];
  selectedRoleDefinition: IRoleDefinitionV2;
  isPrecheckSuccess: boolean;
  rolePreconditionList: PreconditionCheck[] = [];
  expirationTime: number;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { did: string },
    public dialogRef: MatDialogRef<NewIssueVcComponent>,
    private issuanceVcService: IssuanceVcService
  ) {}

  ngOnInit(): void {
    this.setDid();
    this.setPossibleRoles();
  }

  roleTypeSelected(e: MatSelectChange) {
    this.expirationTime = undefined;
    if (e?.value?.definition) {
      this.expirationTime = e.value.definition.defaultValidityPeriod
        ? Date.now() + e.value.definition.defaultValidityPeriod
        : undefined;
      this.fieldList = e.value.definition.issuerFields || [];
      this.selectedRoleDefinition = e.value.definition;
      this.setPreconditions();
    }
  }

  private setPreconditions(): void {
    [this.isPrecheckSuccess, this.rolePreconditionList] = preconditionCheck(
      this.selectedRoleDefinition.enrolmentPreconditions,
      this.getClaims()
    );
  }

  getClaims() {
    return this.issuanceVcService.assetClaims;
  }

  getFormSubject() {
    return this.form.get('subject');
  }

  displayType(): boolean {
    return this.isFormSubjectValid() || this.isDidPredefined();
  }

  getFormType() {
    return this.form.get('type');
  }

  isFormSubjectValid(): boolean {
    return this.getFormSubject().valid;
  }

  isDidPredefined(): boolean {
    return Boolean(this.data?.did);
  }

  scannedValue(did: string): void {
    this.form.patchValue({ subject: did });
  }

  isFormDisabled(): boolean {
    return this.form.invalid || !this.isPrecheckSuccess;
  }

  create(e: EnrolmentSubmission) {
    if (this.isFormDisabled() && e.valid) {
      return;
    }
    this.issuanceVcService
      .create({
        subject: this.getFormSubject().value,
        claim: this.createClaim(e.fields),
        expirationTimestamp: this.expirationTime,
      })
      .subscribe(() => this.dialogRef.close());
  }

  clearExpirationDate(): void {
    this.expirationTime = undefined;
  }

  setExpirationTimeUsingValidity(validityPeriod: number): void {
    this.expirationTime = Date.now() + validityPeriod;
  }

  private setPossibleRoles(): void {
    this.getPossibleRolesForPassedDID();
    this.getPossibleRolesWithPredefinedDID();
  }

  private getPossibleRolesForPassedDID(): void {
    this.getFormSubject()
      .valueChanges.pipe(
        filter(() => this.isFormSubjectValid()),
        switchMap((did) => this.issuanceVcService.getNotEnrolledRoles(did))
      )
      .subscribe((list) => (this.possibleRolesToEnrol = list));
  }

  private getPossibleRolesWithPredefinedDID(): void {
    if (this.getFormSubject().disabled) {
      this.issuanceVcService
        .getNotEnrolledRoles(this.getFormSubject().value)
        .subscribe((list) => (this.possibleRolesToEnrol = list));
    }
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({ subject: this.data.did });
      this.getFormSubject().disable();
    }
  }

  private createClaim(fields) {
    // TODO: Move this method to separate service and use it in request-claim component.
    const parseVersion = (version: string | number) => {
      if (typeof version === 'string') {
        return parseInt(version.split('.')[0], 10);
      }
      return version;
    };

    return {
      claimType: this.getFormType().value.namespace,
      claimTypeVersion:
        parseVersion(this.selectedRoleDefinition.version) ||
        DEFAULT_CLAIM_TYPE_VERSION,
      issuerFields: fields,
    };
  }
}
