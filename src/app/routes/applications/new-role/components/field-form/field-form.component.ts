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
import { isValidJsonFormatValidator } from '@utils';
import { FieldTypesEnum } from './field-form.enum';

const JSON_PLACEHOLDER = {
  "type": "object",
  "patternProperties": {
    "^[0-9]*$": {
      "type": "object",
      "properties": {
        "operations": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "label": {
                  "type": "string"
                },
                "address": {
                  "type": "string"
                },
                "energyConsumed": {
                  "type": "string"
                },
                "enrolled": {
                  "type": "boolean"
                },
                "dispatched": {
                  "type": "boolean"
                }
              },
              "required": [
                "label",
                "address",
                "energyConsumed",
                "enrolled",
                "dispatched"
              ]
            }
          ]
        },
        "certifications": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "instrument": {
                  "type": "string"
                },
                "unitQuantity": {
                  "type": "integer"
                },
                "location": {
                  "type": "string"
                }
              },
              "required": [
                "instrument",
                "unitQuantity",
                "location"
              ]
            }
          ]
        }
      },
      "required": [
        "operations",
        "certifications"
      ]
    },
  },
  "additionalProperties": false
}

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
      schema: ['', {validators: [isValidJsonFormatValidator]}],
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

  get jsonPlaceholder(): string {
    return JSON.stringify(JSON_PLACEHOLDER);
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
    if(value.fieldType === FieldTypesEnum.Json) {
      debugger;
    }
    console.log(this.fieldsForm.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let retVal: any = value;

    if (value && value.fieldType) {
      let validation;
      const { required, minLength, maxLength, pattern, minValue, maxValue, schema } =
        value.validation;

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
           validation = {
            required,
            schema: JSON.stringify(JSON.parse(schema)).replace(/\s/g,''),
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
