import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PreconditionType } from 'iam-client-lib';
import { RolePreconditionType } from '../../../routes/registration/request-claim/request-claim.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';

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

    this.form.get('subject').valueChanges.subscribe(async (d) => {
      if (this.form.get('subject').valid) {
        await this.getNotEnrolledRoles(d);
      }

    });
  }

  async roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      console.log(e);
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);
      if (this.form.get('subject').valid) {
        await this.getNotEnrolledRoles(this.form.get('subject').value);
      }
      console.log(this.rolePreconditionList);
      console.log(this.isPrecheckSuccess);

    }
  }

  isRolePreconditionApproved(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.APPROVED;
  }

  isRolePreconditionPending(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.PENDING;
  }

  private _preconditionCheck(preconditionList: any[]) {
    let retVal = true;

    if (preconditionList && preconditionList.length) {
      for (const precondition of preconditionList) {
        switch (precondition.type) {
          case PreconditionType.Role:
            // Check for Role Conditions
            this.rolePreconditionList = [];

            const conditions = precondition.conditions;
            if (conditions) {
              for (const roleCondition of conditions) {
                const status = this._getRoleConditionStatus(roleCondition, []);
                this.rolePreconditionList.push({
                  namespace: roleCondition,
                  status
                });

                if (status !== RolePreconditionType.SYNCED) {
                  retVal = false;
                }
              }
            }
            break;
        }
      }
    }

    return retVal;
  }

  private async getNotEnrolledRoles(did) {
    this.loadingService.show();
    let roleList = [...this.roles];

    const list = (await this.iamService.claimsService.getClaimsBySubject({
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

  private _getRoleConditionStatus(namespace: string, roleList) {
    let status = RolePreconditionType.PENDING;

    // Check if namespace exists in synced DID Doc Roles
    for (const roleObj of roleList) {
      if (roleObj.claimType === namespace) {
        if (roleObj.isAccepted) {
          if (roleObj.isSynced) {
            status = RolePreconditionType.SYNCED;
          } else {
            status = RolePreconditionType.APPROVED;
          }
        }
        break;
      }
    }

    return status;
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
    this.issuanceVcService.create({subject: this.form.get('subject').value, claim: this.createClaim()})
      .subscribe((data) => {
        console.log(data);
        this.dialogRef.close();
      });
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({subject: this.data.did});
      this.form.get('subject').disable();
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
