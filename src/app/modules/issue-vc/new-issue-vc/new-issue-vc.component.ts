import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolePreconditionType } from '../../../routes/registration/request-claim/request-claim.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { preconditionCheck } from '../../../routes/registration/utils/precondition-check';
import { filter, switchMap } from 'rxjs/operators';
import { RequiredFields } from '../../required-fields/components/required-fields/required-fields.component';
import { from } from 'rxjs';

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
  roles;
  possibleRolesToEnrol;
  selectedRoleDefinition;
  selectedNamespace;
  isPrecheckSuccess;
  rolePreconditionList = [];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { did: string },
              public dialogRef: MatDialogRef<NewIssueVcComponent>,
              private loadingService: LoadingService,
              private iamService: IamService,
              private issuanceVcService: IssuanceVcService) {
  }

  ngOnInit(): void {
    this.issuanceVcService.getIssuerRoles().subscribe((roles) => {
      this.roles = roles;
    });
    this.setDid();

    this.getFormSubject().valueChanges
      .pipe(
        filter(() => this.isFormSubjectValid()),
        switchMap((did) => from(this.getNotEnrolledRoles(did)))
      )
      .subscribe((roles) => this.possibleRolesToEnrol = roles);
  }

  async roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRoleDefinition = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.setPreconditions();
      if (this.isFormSubjectValid()) {
        await this.getNotEnrolledRoles(this.getFormSubject().value);
      }

    }
  }

  private setPreconditions(): void {
    [this.isPrecheckSuccess, this.rolePreconditionList] = preconditionCheck(this.selectedRoleDefinition.enrolmentPreconditions, []);
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

  isFormSubjectValid(): boolean {
    return this.getFormSubject().valid;
  }

  private async getNotEnrolledRoles(did) {
    this.loadingService.show();
    let roleList = [...this.roles];

    const assetClaims = (await this.iamService.iam.getClaimsBySubject({
      did
    })).filter((claim) => !claim.isRejected);

    if (roleList && roleList.length) {
      roleList = roleList.filter((role: any) => {
        let retVal = true;
        for (let i = 0; i < assetClaims.length; i++) {
          if (role.namespace === assetClaims[i].claimType &&
            // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
            role.definition.version.toString().split('.')[0] === assetClaims[i].claimTypeVersion.toString().split('.')[0]) {

            retVal = false;
            break;
          }
        }

        return retVal;
      });
    }
    this.loadingService.hide();
    return roleList;
  }

  keyValueListHandler(e) {
    this.fieldList = e;
  }

  isDidPredefined(): boolean {
    return Boolean(this.data?.did);
  }

  scannedValue(data: { value: string }) {
    this.form.patchValue({subject: data.value});
  }

  isFormDisabled() {
    return this.form.invalid || !this.isPrecheckSuccess || !this.requiredFields.isValid();
  }

  create() {
    if (this.isFormDisabled()) {
      return;
    }
    this.issuanceVcService.create({subject: this.getFormSubject().value, claim: this.createClaim()})
      .subscribe(() => this.dialogRef.close());
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
      fields: this.fieldList,
      claimType: this.selectedNamespace,
      claimTypeVersion: parseVersion(this.selectedRoleDefinition.version) || DEFAULT_CLAIM_TYPE_VERSION,
      claimParams: this.requiredFields.fieldsData()
    };
  }
}
