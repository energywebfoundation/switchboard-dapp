import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { KeyValue } from '../key-value.interface';

@Component({
  selector: 'app-key-value-form',
  templateUrl: './key-value-form.component.html',
  styleUrls: ['./key-value-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyValueFormComponent {
  @Output() add = new EventEmitter<KeyValue>();
  @Output() cancel = new EventEmitter();

  form = this.fb.group({
    key: ['', [Validators.required]],
    value: ['', [Validators.required]]
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
