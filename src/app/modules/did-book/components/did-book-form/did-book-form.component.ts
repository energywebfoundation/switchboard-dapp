import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HexValidators } from '@utils';
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
  @Output() add = new EventEmitter<Partial<DidBookRecord>>();
  @Output() cancel = new EventEmitter<Partial<DidBookRecord>>();

  form = this.fb.group({
    label: ['', [Validators.required]],
    did: ['', [Validators.required, HexValidators.isDidValid()]],
  });

  get isFormInvalid() {
    return this.form.invalid;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.setPredefinedDid();
    this.setPredefinedLabel();
  }

  submit() {
    if (this.isFormInvalid) {
      return;
    }
    this.add.emit(this.form.getRawValue());
    this.clear();
  }

  reject() {
    this.cancel.emit();
    this.form.reset();
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
