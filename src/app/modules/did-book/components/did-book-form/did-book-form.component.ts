import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators, ListValidator } from '@utils';
import { DidBookRecord } from '../models/did-book-record';

@Component({
  selector: 'app-did-book-form',
  templateUrl: './did-book-form.component.html',
  styleUrls: ['./did-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidBookFormComponent implements OnInit {
  @Input() did: string;
  @Input() label: string;
  @Input() shouldClearForm: boolean;
  @Input() shouldCloseForm: boolean;
  @Input() set existingDIDs(dids: string[]) {
    if (!dids) {
      return;
    }
    this.form
      .get('did')
      .setValidators([
        Validators.required,
        HexValidators.isDidValid(),
        ListValidator.stringExist(dids),
      ]);
  }
  @Output() add = new EventEmitter<Partial<DidBookRecord>>();
  @Output() cancel = new EventEmitter<Partial<DidBookRecord>>();

  form = this.fb.group({
    label: ['', [Validators.required]],
    did: ['', [Validators.required, HexValidators.isDidValid()]],
  });

  get isFormInvalid(): boolean {
    return this.form.invalid;
  }

  get clearDisabled(): boolean {
    return !this.form.getRawValue().label && !this.form.getRawValue().did;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setPredefinedDid();
    this.setPredefinedLabel();
  }

  submit(): void {
    if (this.isFormInvalid) {
      return;
    }
    this.add.emit(this.form.getRawValue());
    this.clear();
  }

  closeForm(): void {
    this.cancel.emit();
  }

  clearForm(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.form.reset();
  }

  getDIDError(errorCode: string): boolean {
    return this.form.get('did').hasError(errorCode);
  }

  private clear(): void {
    this.form.reset();
  }

  private setPredefinedDid(): void {
    if (this.did) {
      this.form.patchValue({ did: this.did });
    }
  }

  private setPredefinedLabel(): void {
    if (this.label) {
      this.form.patchValue({ label: this.label });
    }
  }
}
