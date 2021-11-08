import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolePreconditionType } from '../../../routes/registration/request-claim/request-claim.component';
import { preconditionCheck } from '../../../routes/registration/utils/precondition-check';
import { filter, switchMap } from 'rxjs/operators';
import { RequiredFields } from '../../required-fields/components/required-fields/required-fields.component';

const DEFAULT_CLAIM_TYPE_VERSION = 1;

@Component({
  selector: 'app-new-issue-vc',
  templateUrl: './new-issue-vc.component.html',
  styleUrls: ['./new-issue-vc.component.scss']
})
export class NewIssueVcComponent implements OnInit {
  @ViewChild('requiredFields') requiredFields: RequiredFields;
  fieldList = [];
  form = this.fb.group({
    subject: ['', [Validators.required, HexValidators.isDidValid()]],
    type: ['', [Validators.required]]
  });
  possibleRolesToEnrol;
  selectedRoleDefinition;
  isPrecheckSuccess;
  rolePreconditionList = [];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { did: string },
              public dialogRef: MatDialogRef<NewIssueVcComponent>,
              private issuanceVcService: IssuanceVcService) {
  }

  ngOnInit(): void {
    this.setDid();
    this.setPossibleRoles();
  }

  roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRoleDefinition = e.value.definition;
      this.setPreconditions();
    }
  }

  private setPreconditions(): void {
    [this.isPrecheckSuccess, this.rolePreconditionList] = preconditionCheck(this.selectedRoleDefinition.enrolmentPreconditions, this.issuanceVcService.assetClaims);
  }

  isRolePreconditionApproved(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.APPROVED;
  }

  isRolePreconditionPending(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.PENDING;
  }

  getFormSubject() {
    return this.form.get('subject');
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
    this.form.patchValue({subject: did});
  }

  isFormDisabled(): boolean {
    if (!this.requiredFields) {
      return this.form.invalid || !this.isPrecheckSuccess;
    }
    return this.form.invalid || !this.isPrecheckSuccess || !this.requiredFields?.isValid();
  }

  create() {
    if (this.isFormDisabled()) {
      return;
    }
    this.issuanceVcService.create({subject: this.getFormSubject().value, claim: this.createClaim()})
      .subscribe(() => this.dialogRef.close());
  }

  private setPossibleRoles() {
    this.getFormSubject().valueChanges
      .pipe(
        filter(() => this.isFormSubjectValid()),
        switchMap((did) => this.issuanceVcService.getNotEnrolledRoles(did)),
      ).subscribe((list) => this.possibleRolesToEnrol = list);
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({subject: this.data.did});
      this.getFormSubject().disable();
    }
  }

  private createClaim() {
    const parseVersion = (version: string | number) => {
      if (typeof (version) === 'string') {
        return parseInt(version.split('.')[0], 10);
      }
      return version;
    };

    return {
      claimType: this.getFormType().value.namespace,
      claimTypeVersion: parseVersion(this.selectedRoleDefinition.version) || DEFAULT_CLAIM_TYPE_VERSION,
      claimParams: this.requiredFields?.fieldsData()
    };
  }
}
