import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolePreconditionType } from '../../../routes/registration/request-claim/request-claim.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { preconditionCheck } from '../../../routes/registration/utils/precondition-check';
import { filter } from 'rxjs/operators';

const DEFAULT_CLAIM_TYPE_VERSION = 1;

@Component({
  selector: 'app-new-issue-vc',
  templateUrl: './new-issue-vc.component.html',
  styleUrls: ['./new-issue-vc.component.scss']
})
export class NewIssueVcComponent implements OnInit {
  fieldList = [];
  form = this.fb.group({
    subject: ['', [Validators.required, HexValidators.isDidValid()]],
    type: ['', [Validators.required]]
  });
  roles;
  selectedRole;
  selectedNamespace;
  isPrecheckSuccess;
  alreadyEnroled;
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
      .pipe(filter(() => this.isFormSubjectValid()))
      .subscribe(async (d) => await this.getNotEnrolledRoles(d));
  }

  async roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      console.log(e);
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.setPreconditions();
      if (this.isFormSubjectValid()) {
        await this.getNotEnrolledRoles(this.getFormSubject().value);
      }
      console.log(this.rolePreconditionList);
      console.log(this.isPrecheckSuccess);

    }
  }

  private setPreconditions(): void {
    [this.isPrecheckSuccess, this.rolePreconditionList] = preconditionCheck(this.selectedRole.enrolmentPreconditions, []);
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

    const list = (await this.iamService.iam.getClaimsBySubject({
      did
    })).filter((claim) => !claim.isRejected);

    if (roleList && roleList.length) {
      const role = this.form.value.type;
      console.log(role);
      this.alreadyEnroled =
        list.some(el => {
          return role.namespace === el.claimType &&
            // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
            role.definition.version.toString().split('.')[0] === el.claimTypeVersion.toString().split('.')[0] && role.namespace === this.form.get('type').value.namespace;
        });
      console.log(list);
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

  getControl(control: string) {
    return this.form.get(control);
  }

  scannedValue(data: { value: string }) {
    this.form.patchValue({subject: data.value});
  }

  isFormDisabled() {
    return this.form.invalid || this.alreadyEnroled || !this.isPrecheckSuccess;
  }

  create() {
    if (this.isFormDisabled()) {
      return;
    }
    this.issuanceVcService.create({subject: this.getFormSubject().value, claim: this.createClaim()})
      .subscribe((data) => {
        console.log(data);
        this.dialogRef.close();
      });
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
      claimTypeVersion: parseVersion(this.selectedRole.version) || DEFAULT_CLAIM_TYPE_VERSION
    };
  }
}
