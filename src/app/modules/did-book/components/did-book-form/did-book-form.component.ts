import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';

@Component({
  selector: 'app-did-book-form',
  templateUrl: './did-book-form.component.html',
  styleUrls: ['./did-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidBookFormComponent implements OnInit {
  @Input() did;
  @Output() add = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form = this.fb.group({
    label: ['', [Validators.required]],
    did: ['', [Validators.required, HexValidators.isDidValid()]]
  });


  get isFormInvalid() {
    return this.form.invalid;
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.setPredefinedDid();
  }

  submit() {
    if (this.isFormInvalid) {
      return;
    }
    this.add.emit(this.form.value);
    this.clear();
  }

  reject() {
    this.cancel.emit();
    this.form.reset();
  }

  private clear(): void {
    this.form.reset();
  }

  private setPredefinedDid() {
    if (this.did) {
      this.form.patchValue({did: this.did});
    }
  }

}
