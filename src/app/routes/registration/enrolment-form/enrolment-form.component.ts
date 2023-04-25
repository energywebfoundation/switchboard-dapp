/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationTypes } from 'iam-client-lib';
import { KeyValue } from '@angular/common';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';
import { FieldTypesEnum } from '../../applications/new-role/components/field-form/field-form.enum';
import { JsonEditorOptions } from '@modules';
import Ajv, { Schema } from 'ajv';

export interface EnrolmentField {
  key: string;
  value: any;
}

export interface EnrolmentSubmission {
  fields: KeyValue<string, string>[];
  registrationTypes: RegistrationTypes[];
  valid: boolean;
}

export interface EnrolmentForm {
  isValid(): boolean;

  fieldsData(): KeyValue<string, string>[];

  getRegistrationTypes(): RegistrationTypes[];
}

@Component({
  selector: 'app-enrolment-form',
  templateUrl: './enrolment-form.component.html',
  styleUrls: ['./enrolment-form.component.scss'],
})
export class EnrolmentFormComponent implements EnrolmentForm {
  enrolmentForm: FormGroup = new FormGroup({
    fields: new FormArray([]),
  });

  @Input() showSubmit = true;
  @Input() namespaceRegistrationRoles: Set<RegistrationTypes>;
  get fieldList(): IFieldDefinition[] {
    return this.fields;
  }
  @Input() set fieldList(list: IFieldDefinition[]) {
    this.fields = list;
    this.updateEnrolmentForm(new FormArray(this.createControls(list)));
  }
  @Input() set toCopy(copyInput: Record<string, string | number> | undefined) {
    if (!copyInput || Object.keys(copyInput).length === 0) {
      return;
    }
    this.updateFormFields(copyInput);
  }

  @Input() txtboxColor;
  @Input() txtColor;
  @Input() btnColor;
  @Input() disabledSubmit: boolean;
  @Output() submitForm = new EventEmitter<EnrolmentSubmission>();

  private fields: IFieldDefinition[];
  isValidSchema = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  createOptions(schema) {
    const jsonOptions = new JsonEditorOptions();
    jsonOptions.mode = 'code';
    jsonOptions.modes = ['tree', 'view', 'form', 'code'];
    jsonOptions.schema = schema;
    return jsonOptions;
  }

  isValid() {
    return this.enrolmentForm.valid && this.isValidSchema;
  }

  updateFormFields(copyInput: Record<string, string | number>) {
    const fieldLabel = Object.keys(copyInput)[0];
    const fieldListItemIndex = this.fieldList.findIndex(
      (fld) => fld.label === fieldLabel
    );
    if (fieldListItemIndex === -1) {
      return;
    }
    const fieldListItem = this.fieldList[fieldListItemIndex];
    const valueToSet =
      fieldListItem.fieldType === 'json'
        ? JSON.parse(copyInput[fieldLabel] as string)
        : copyInput[fieldLabel];
    (this.enrolmentForm?.get('fields') as FormArray)?.controls[
      fieldListItemIndex
    ].setValue(valueToSet);
  }

  fieldsData(): KeyValue<string, string>[] {
    return this.buildEnrolmentFormFields();
  }

  submit() {
    if (this.disabledSubmit) {
      return;
    }
    this.submitForm.emit({
      fields: this.buildEnrolmentFormFields(),
      registrationTypes: this.getRegistrationTypes(),
      valid: this.isValid(),
    });
  }

  getRegistrationTypes(): RegistrationTypes[] {
    return [RegistrationTypes.OffChain, RegistrationTypes.OnChain];
  }

  private buildEnrolmentFormFields() {
    const values = this.enrolmentForm.value.fields;
    return this.fieldList.map((field, index) => ({
      key: field.label,
      value: field.schema ? JSON.stringify(values[index]) : values[index],
    }));
  }

  checkJson(e, schema: Schema): void {
    if (e instanceof Event) {
      return;
    }
    const ajv = new Ajv();
    this.isValidSchema = ajv.validate(schema, e) as boolean;
  }

  private updateEnrolmentForm(formArray: FormArray) {
    this.enrolmentForm.removeControl('fields');
    this.enrolmentForm.registerControl('fields', formArray);
    this.cdRef.detectChanges();
  }

  getControl(id: number): FormControl {
    return (this.enrolmentForm?.get('fields') as FormArray)?.controls[
      id
    ] as FormControl;
  }

  private createControls(list) {
    return list.map((field) => {
      this.setFieldDefaults(field);

      const control = new FormControl();
      control.setValidators(this.buildValidationOptions(field));
      return control;
    });
  }

  private setFieldDefaults(field) {
    switch (field.fieldType) {
      case FieldTypesEnum.Text:
        break;
      case FieldTypesEnum.Number:
        break;
      case FieldTypesEnum.Date:
        if (field.maxDate) {
          field.maxDate = new Date(field.maxDate);
        }
        if (field.minDate) {
          field.minDate = new Date(field.minDate);
        }
        break;
      case FieldTypesEnum.Boolean:
        break;
      case FieldTypesEnum.Json:
        break;
    }
  }

  private buildValidationOptions(field: any) {
    const validations = [];

    if (field.required) {
      validations.push(Validators.required);
    }

    if (field.minLength) {
      validations.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validations.push(Validators.maxLength(field.maxLength));
    }

    if (field.pattern) {
      validations.push(Validators.pattern(field.pattern));
    }

    if (field.minValue) {
      validations.push(Validators.min(field.minValue));
    }

    if (field.maxValue) {
      validations.push(Validators.max(field.maxValue));
    }

    return validations;
  }
}
