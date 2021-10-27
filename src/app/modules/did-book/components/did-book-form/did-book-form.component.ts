import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '../../../../utils/validators/is-hex/is-hex.validator';

@Component({
  selector: 'app-did-book-form',
  templateUrl: './did-book-form.component.html',
  styleUrls: ['./did-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidBookFormComponent {
  @Input() data;
  @Output() add = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form = this.fb.group({
    label: ['', [Validators.required]],
    did: ['', [Validators.required, HexValidators.isDidValid()]]
  });

  constructor(private fb: FormBuilder) {
  }

  get isFormInvalid() {
    return this.form.invalid;
  }

  submit() {
    if (this.isFormInvalid) {
      return;
    }
    this.add.emit(this.form.value);
  }

  reject() {
    this.cancel.emit();
  }

}
