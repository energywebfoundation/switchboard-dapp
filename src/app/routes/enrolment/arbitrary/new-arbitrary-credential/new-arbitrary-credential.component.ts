import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';
import { IssuanceVcService } from '../services/issuance-vc.service';

@Component({
  selector: 'app-new-arbitrary-credential',
  templateUrl: './new-arbitrary-credential.component.html',
  styleUrls: ['./new-arbitrary-credential.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewArbitraryCredentialComponent implements OnInit {

  form = this.fb.group({
    did: ['', [Validators.required, HexValidators.isDidValid()]],
    name: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              private issuanceVcService: IssuanceVcService) {
  }

  getControl(control: string) {
    return this.form.get(control);
  }

  ngOnInit(): void {
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
}
