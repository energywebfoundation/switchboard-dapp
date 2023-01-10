import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FieldValidationService } from '../../../../../shared/services/field-validation.service';
import { Subject } from 'rxjs';
import { truthy } from '@operators';
import { FieldTypesEnum } from './field-form.enum';
import Ajv from 'ajv';
import { JsonEditorComponent, JsonEditorOptions } from '@modules';

const FIELD_TYPES = [
  FieldTypesEnum.Text,
  FieldTypesEnum.Number,
  FieldTypesEnum.Date,
  FieldTypesEnum.Boolean,
  FieldTypesEnum.Json,
];

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss'],
})
export class FieldFormComponent implements OnInit, OnDestroy {
  @Input() data: {
    fieldType: FieldTypesEnum;
    label: string;
    required: boolean;
    schema?: string;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    minDate?: string;
    maxDate?: string;
  };
  @Output() added = new EventEmitter();
  @Output() updated = new EventEmitter();
  @Output() canceled = new EventEmitter();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;
  isValidSchema = true;

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
      schema: [undefined],
    }),
  });
  private subscription$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private fieldValidationService: FieldValidationService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['tree', 'view', 'form', 'code', 'text'];
    this.editorOptions.mode = 'code';
  }

  checkJson(e): void {
    if (e instanceof Event) {
      return;
    }
    if (this.fieldsForm.get('fieldType').value !== FieldTypesEnum.Json) {
      return;
    }
    const ajv = new Ajv();
    this.isValidSchema = ajv.validateSchema(e) as boolean;
  }

  ngOnInit(): void {
    this._induceInt();
    this._induceRanges();
    this.updateForm();
  }

  get isText(): boolean {
    return this.fieldsForm?.value?.fieldType === FieldTypesEnum.Text;
  }

  get isDate(): boolean {
    return this.fieldsForm?.value?.fieldType === FieldTypesEnum.Date;
  }

  get isNumber(): boolean {
    return this.fieldsForm?.value?.fieldType === FieldTypesEnum.Number;
  }

  get isJSON(): boolean {
    return this.fieldsForm?.value?.fieldType === FieldTypesEnum.Json;
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

  get isInvalid() {
    return this.fieldsForm.invalid || !this.isValidSchema;
  }

  add() {
    if (this.isInvalid) {
      return;
    }
    this.added.emit(this._extractValidationObject(this.fieldsForm.value));
  }

  update() {
    if (this.isInvalid) {
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
      const {
        required,
        minLength,
        maxLength,
        pattern,
        minValue,
        maxValue,
        schema,
      } = value.validation;

      const { minDate, maxDate } = value.validation;

      switch (value.fieldType) {
        case FieldTypesEnum.Text:
          validation = {
            required,
            minLength,
            maxLength,
            pattern,
          };
          break;
        case FieldTypesEnum.Number:
          validation = {
            required,
            minValue,
            maxValue,
          };
          break;
        case FieldTypesEnum.Date:
          validation = {
            required,
            minDate,
            maxDate,
          };
          break;
        case FieldTypesEnum.Boolean:
          validation = {
            required,
          };
          break;
        case FieldTypesEnum.Json:
          console.log(schema);
          validation = {
            required,
            schema: JSON.stringify(schema),
          };
          break;
        default:
          validation = value.validation;
      }
      retVal = Object.assign(retVal, validation);
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
        if (this.data.fieldType === FieldTypesEnum.Json) {
          valueToPatch[fieldKey] = JSON.parse(this.data.schema);
        }
      });

      console.log('valueToPatch', valueToPatch);
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
