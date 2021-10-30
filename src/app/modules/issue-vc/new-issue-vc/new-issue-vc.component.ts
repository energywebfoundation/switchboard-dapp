import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  EnrolmentField,
  EnrolmentSubmission
} from '../../../routes/registration/enrolment-form/enrolment-form.component';
import { PreconditionTypes } from 'iam-client-lib';
import { RolePreconditionType } from '../../../routes/registration/request-claim/request-claim.component';

@Component({
  selector: 'app-new-issue-vc',
  templateUrl: './new-issue-vc.component.html',
  styleUrls: ['./new-issue-vc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  rolePreconditionList = [];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { did: string },
              private issuanceVcService: IssuanceVcService) {
  }

  ngOnInit(): void {
    this.issuanceVcService.getIssuerRoles().subscribe((roles) => {
      this.roles = roles;
    });
    this.setDid();
  }

  roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      console.log(e);
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);

    }
  }

  private _preconditionCheck(preconditionList: any[]) {
    let retVal = true;

    if (preconditionList && preconditionList.length) {
      for (const precondition of preconditionList) {
        switch (precondition.type) {
          case PreconditionTypes.Role:
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

  // private async getNotEnrolledRoles() {
  //   let roleList = await this.iamService.iam.getRolesByNamespace({
  //     parentType: this.roleType === RoleType.APP ? ENSNamespaceTypes.Application : ENSNamespaceTypes.Organization,
  //     namespace: this.namespace
  //   });
  //
  //   if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
  //     this.userRoleList = (await this.iamService.iam.getClaimsBySubject({
  //       did: this.form.value.subject
  //     })).filter((claim: Claim) => !claim.isRejected);
  //   }
  //
  //   if (roleList && roleList.length) {
  //     roleList = roleList.filter((role: any) => {
  //       let retVal = true;
  //       const defaultRole = `${this.defaultRole}.${ENSNamespaceTypes.Roles}.${this.namespace}`;
  //       for (let i = 0; i < this.userRoleList.length; i++) {
  //         if (role.namespace === this.userRoleList[i].claimType &&
  //           // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
  //           role.definition.version.toString().split('.')[0] === this.userRoleList[i].claimTypeVersion.toString().split('.')[0]) {
  //           if (role.namespace === defaultRole) {
  //             // Display Error
  //             if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
  //               this.displayAlert('Your asset has already enrolled to this role.', 'error');
  //             } else {
  //               this.displayAlert('You have already enrolled to this role.', 'error');
  //             }
  //           }
  //           retVal = false;
  //           break;
  //         }
  //       }
  //
  //       return retVal;
  //     });
  //   }
  //
  //   return roleList;
  // }

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
    return this.form.invalid;
  }

  create(data: EnrolmentSubmission) {
    if (this.isFormDisabled()) {
      return;
    }
    this.issuanceVcService.create({subject: this.form.get('subject').value, claim: this.createClaim(data.fields)});
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({subject: this.data.did});
      this.form.get('subject').disable();
    }
  }

  private createClaim(fields: EnrolmentField[]) {
    const parseVersion = (version: string | number) => {
      if (typeof (version) === 'string') {
        return parseInt(version.split('.')[0], 10);
      }
      return version;
    };

    return {
      fields: JSON.parse(JSON.stringify(fields)),
      // claimType: this.selectedNamespace,
      claimTypeVersion: 1 //parseVersion(this.selectedRole.version) || DEFAULT_CLAIM_TYPE_VERSION
    };
  }
}
