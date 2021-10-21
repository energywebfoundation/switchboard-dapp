import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-issue-vc',
  templateUrl: './new-issue-vc.component.html',
  styleUrls: ['./new-issue-vc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewIssueVcComponent implements OnInit {
  fieldList = [];
  form = this.fb.group({
    did: ['', [Validators.required, HexValidators.isDidValid()]],
    name: ['', [Validators.required]],
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
    this.form.patchValue({did: data.value});
  }

  isFormDisabled() {
    return this.form.invalid;
  }

  create() {
    if (this.isFormDisabled()) {
      return;
    }
    this.issuanceVcService.create(this.form.value, this.fieldList);
  }

  fieldListChangeHandler(data) {
    this.fieldList = [...data];
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({did: this.data.did});
      this.form.get('did').disable();
    }
  }
}
