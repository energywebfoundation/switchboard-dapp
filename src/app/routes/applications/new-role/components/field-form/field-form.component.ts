import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FieldValidationService } from '../../../../../shared/services/field-validation.service';
import { Subject } from 'rxjs';

const FIELD_TYPES = [
  'text', 'number', 'date', 'boolean'
];

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss']
})
export class FieldFormComponent implements OnInit {
  isEditFieldForm;
  public FieldTypes = FIELD_TYPES;
  @Input() data;
  @Output() added = new EventEmitter();
  @Output() updated = new EventEmitter();
  @Output() canceled = new EventEmitter();

  fieldsForm: FormGroup = this.fb.group({
    fieldType: ['', Validators.required],
    label: ['', Validators.required],
    validation: this.fb.group({
      required: undefined,
      minLength: [undefined, {
        validators: Validators.min(0),
        updateOn: 'blur'
      }],
      maxLength: [undefined, {
        validators: Validators.min(1),
        updateOn: 'blur'
      }],
      pattern: undefined,
      minValue: [undefined, {
        updateOn: 'blur'
      }],
      maxValue: [undefined, {
        updateOn: 'blur'
      }],
      minDate: undefined,
      maxDate: undefined
    })
  });
  private subscription$ = new Subject();

  constructor(private fb: FormBuilder,
              private fieldValidationService: FieldValidationService) {
  }

  ngOnInit(): void {
    this._induceInt();
    this._induceRanges();
    if (this.data) {
      this.isEditFieldForm = true;
      // TODO:: check if this is needed. Maybe patch is enough.
      const fieldKeys = Object.keys(this.data);
      const valueToPatch = {};
      fieldKeys.map(fieldKey => {
        this.fieldsForm.get(fieldKey)?.setValue(this.data[fieldKey]);
        valueToPatch[fieldKey] = this.data[fieldKey];
      });

      this.fieldsForm.get('validation').patchValue(valueToPatch);
      // this.fieldsForm.patchValue(this.data);
    }
  }


  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  cancel() {
    this.canceled.emit();
  }

  add() {
    if (this.fieldsForm.invalid) {
      return;
    }

    this.added.emit(this.fieldsForm.value);
  }

  update() {
    if (this.fieldsForm.invalid) {
      return;
    }
    this.updated.emit(this.fieldsForm.value);
  }

  private _induceInt() {
    const minLength = this.fieldsForm.get('validation').get('minLength');
    const maxLength = this.fieldsForm.get('validation').get('maxLength');

    minLength.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe(data => {
        if (data) {
          minLength.setValue(parseInt(data), {emitEvent: false});
        }
      });

    maxLength.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe(data => {
        if (data) {
          maxLength.setValue(parseInt(data), {emitEvent: false});
        }
      });
  }

  private _induceRanges() {
    // Min & Max Length Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minLength'),
      this.fieldsForm.get('validation').get('maxLength')
    );

    // Min & Max Value Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minValue'),
      this.fieldsForm.get('validation').get('maxValue')
    );

    // Min & Max Date Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minDate'),
      this.fieldsForm.get('validation').get('maxDate')
    );
  }

}
