import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
import { FieldTypesEnum } from './field-form.enum';
import Ajv from 'ajv';
import { JsonEditorComponent, JsonEditorOptions } from '@modules';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';

const FIELD_TYPES = [
  FieldTypesEnum.Text,
  FieldTypesEnum.Number,
  FieldTypesEnum.Date,
  FieldTypesEnum.Boolean,
  FieldTypesEnum.Json,
];

export interface IFieldFormData extends Omit<IFieldDefinition, 'fieldType'> {
  fieldType: FieldTypesEnum;
  label: string;
}

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss'],
})
export class FieldFormComponent implements OnInit, OnDestroy {
  @Input() data: IFieldFormData;
  @Output() added = new EventEmitter<IFieldFormData>();
  @Output() updated = new EventEmitter<IFieldFormData>();
  @Output() canceled = new EventEmitter<void>();
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;
  public editorOptions: JsonEditorOptions;

  isValidSchema = true;

  editMode = false;
  FieldTypes = FIELD_TYPES;
  fieldsForm: FormGroup = this.fb.group({
    fieldType: ['', Validators.required],
    label: ['', Validators.required],
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
    if (this.fieldType !== FieldTypesEnum.Json) {
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

  get fieldType(): FieldTypesEnum {
    return this.fieldsForm.get('fieldType').value;
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

  private _extractValidationObject(value: IFieldFormData): IFieldFormData {
    const { label, fieldType, required } = value;

    if (value && value.fieldType) {
      return { label, required, fieldType, ...this.getFieldsObject(value) };
    }
  }

  private getFieldsObject({
    minLength,
    maxLength,
    pattern,
    fieldType,
    minValue,
    maxValue,
    minDate,
    maxDate,
    schema,
  }: IFieldFormData): Partial<IFieldFormData> {
    switch (fieldType) {
      case FieldTypesEnum.Text:
        return {
          minLength,
          maxLength,
          pattern,
        };
      case FieldTypesEnum.Number:
        return {
          minValue,
          maxValue,
        };
      case FieldTypesEnum.Date:
        return {
          minDate,
          maxDate,
        };
      case FieldTypesEnum.Json:
        return {
          schema,
        };
      case FieldTypesEnum.Boolean:
      default:
        return {};
    }
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

      this.fieldsForm.patchValue(valueToPatch);
    }
  }

  private _induceInt() {
    const minLength = this.fieldsForm.get('minLength');
    const maxLength = this.fieldsForm.get('maxLength');

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
      this.fieldsForm.get('minLength'),
      this.fieldsForm.get('maxLength')
    );

    // Min & Max Value Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('minValue'),
      this.fieldsForm.get('maxValue')
    );

    // Min & Max Date Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('minDate'),
      this.fieldsForm.get('maxDate')
    );
  }
}
