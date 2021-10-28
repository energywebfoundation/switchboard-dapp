import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  EnrolmentField,
  EnrolmentSubmission
} from '../../../routes/registration/enrolment-form/enrolment-form.component';

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

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { did: string },
              private issuanceVcService: IssuanceVcService) {
  }

  ngOnInit(): void {
    this.setDid();
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
