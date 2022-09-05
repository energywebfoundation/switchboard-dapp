import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FieldValidationService } from '../../../../../shared/services/field-validation.service';
import { Subject } from 'rxjs';
import { truthy } from '@operators';

const FIELD_TYPES = ['text', 'number', 'date', 'boolean'];

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss'],
})
export class FieldFormComponent implements OnInit, OnDestroy {
  @Input() data;
  @Output() added = new EventEmitter();
  @Output() updated = new EventEmitter();
  @Output() canceled = new EventEmitter();

  editMode = false;
  FieldTypes = FIELD_TYPES;
  fieldsForm: FormGroup = this.fb.group({
    fieldType: ['', Validators.required],
    label: ['', Validators.required],
    validation: this.fb.group({
      required: undefined,
      minLength: [
        undefined,
        {
          validators: Validators.min(0),
          updateOn: 'blur',
        },
      ],
      maxLength: [
        undefined,
        {
          validators: Validators.min(1),
          updateOn: 'blur',
        },
      ],
      pattern: undefined,
      minValue: [
        undefined,
        {
          updateOn: 'blur',
        },
      ],
      maxValue: [
        undefined,
        {
          updateOn: 'blur',
        },
      ],
      minDate: undefined,
      maxDate: undefined,
    }),
  });
  private subscription$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private fieldValidationService: FieldValidationService
  ) {}

  ngOnInit(): void {
    this._induceInt();
    this._induceRanges();
    this.updateForm();
  }

  get isText(): boolean {
    return this.fieldsForm?.value?.fieldType === 'text';
  }

  get isDate(): boolean {
    return this.fieldsForm?.value?.fieldType === 'date';
  }

  get isNumber(): boolean {
    return this.fieldsForm?.value?.fieldType === 'number';
  }

  isFieldTypeDefined() {
    return this.fieldsForm?.value?.fieldType;
  }

  ngOnDestroy(): void {
    this.subscription$.next(null);
    this.subscription$.complete();
  }

  cancel() {
    this.canceled.emit();
  }

  add() {
    if (this.fieldsForm.invalid) {
      return;
    }
    this.added.emit(this._extractValidationObject(this.fieldsForm.value));
  }

  update() {
    if (this.fieldsForm.invalid) {
      return;
    }
    this.updated.emit(this._extractValidationObject(this.fieldsForm.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _extractValidationObject(value: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let retVal: any = value;

    if (value && value.fieldType) {
      let validation;
      const { required, minLength, maxLength, pattern, minValue, maxValue } =
        value.validation;

      const { minDate, maxDate } = value.validation;

      switch (value.fieldType) {
        case 'text':
          validation = {
            required,
            minLength,
            maxLength,
            pattern,
          };
          break;
        case 'number':
          validation = {
            required,
            minValue,
            maxValue,
          };
          break;
        case 'date':
          validation = {
            required,
            minDate,
            maxDate,
          };
          break;
        case 'boolean':
          validation = {
            required,
          };
          break;
        default:
          validation = value.validation;
      }
      retVal = JSON.parse(JSON.stringify(Object.assign(retVal, validation)));
      delete retVal.validation;
    }

    return retVal;
  }

  private updateForm() {
    if (this.data) {
      this.editMode = true;
      const fieldKeys = Object.keys(this.data);
      const valueToPatch = {};
      fieldKeys.map((fieldKey) => {
        this.fieldsForm.get(fieldKey)?.setValue(this.data[fieldKey]);
        valueToPatch[fieldKey] = this.data[fieldKey];
      });

      this.fieldsForm.get('validation').patchValue(valueToPatch);
    }
  }

  private _induceInt() {
    const minLength = this.fieldsForm.get('validation').get('minLength');
    const maxLength = this.fieldsForm.get('validation').get('maxLength');

    this.parseIntControlValue(minLength);
    this.parseIntControlValue(maxLength);
  }

  private parseIntControlValue(control: AbstractControl) {
    control.valueChanges
      .pipe(truthy(), takeUntil(this.subscription$))
      .subscribe((data) =>
        control.setValue(parseInt(data), { emitEvent: false })
      );
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
