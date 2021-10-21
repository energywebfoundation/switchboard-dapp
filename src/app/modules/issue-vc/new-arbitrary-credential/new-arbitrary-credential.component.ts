import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-arbitrary-credential',
  templateUrl: './new-arbitrary-credential.component.html',
  styleUrls: ['./new-arbitrary-credential.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewArbitraryCredentialComponent implements OnInit {
  dataSource = [];
  form = this.fb.group({
    did: ['', [Validators.required, HexValidators.isDidValid()]],
    name: ['', [Validators.required]],
    type: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { did: string },
              private issuanceVcService: IssuanceVcService) {
  }

  isDidPredefined(): boolean {
    return Boolean(this.data?.did);
  }

  getControl(control: string) {
    return this.form.get(control);
  }

  ngOnInit(): void {
    this.setDid();
  }

  scannedValue(data: { value: string }) {
    this.form.patchValue({did: data.value});
  }

  isFormDisabled() {
    return this.form.valid;
  }

  create() {
    this.issuanceVcService.create(this.form.value);
  }

  dataSourceChangeHandler(data) {
    this.dataSource = [...data];
  }

  private setDid() {
    if (this.data?.did) {
      this.form.patchValue({did: this.data.did});
      this.form.get('did').disable();
    }
  }
}
