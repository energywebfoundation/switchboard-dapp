import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { requireCheckboxesToBeCheckedValidator } from '../../../utils/validators/require-checkboxes-to-be-checked.validator';
import { IRoleDefinition, RegistrationTypes } from 'iam-client-lib';
import { KeyValue } from '@angular/common';

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
  styleUrls: ['./enrolment-form.component.scss']
})
export class EnrolmentFormComponent implements EnrolmentForm {

  @Input() showSubmit = true;
  @Input() namespaceRegistrationRoles: Set<RegistrationTypes>;
  @Input() showRegistrationTypes: boolean = true;

  @Input() set fieldList(list: IRoleDefinition['fields']) {
    this.fields = list;
    this.updateEnrolmentForm(new FormArray(this.createControls(list)));
  }

  get fieldList(): IRoleDefinition['fields'] {
    return this.fields;
  }

  @Input() txtboxColor;
  @Input() txtColor;
  @Input() btnColor;
  @Input() disabledSubmit: boolean;
  @Output() submitForm = new EventEmitter<EnrolmentSubmission>();

  enrolmentForm: FormGroup = new FormGroup({
    registrationTypes: new FormGroup({
      offChain: new FormControl({value: true, disabled: false}),
      onChain: new FormControl({value: false, disabled: true}),
    }, requireCheckboxesToBeCheckedValidator()),
    fields: new FormArray([])
  });
  private fields;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  isValid() {
    return this.enrolmentForm.valid;
  }

  fieldsData(): KeyValue<string, string>[] {
    return this.buildEnrolmentFormFields();
  }

  submit() {
    if (this.disabledSubmit) {
      return;
    }
    this.submitForm.next({
      fields: this.buildEnrolmentFormFields(),
      registrationTypes: this.getRegistrationTypes(),
      valid: this.isValid()
    });
  }

  getRegistrationTypes(): RegistrationTypes[] {
    const result = [];
    if (this.registrationTypesGroup.get('offChain').value) {
      result.push(RegistrationTypes.OffChain);
    }

    if (this.registrationTypesGroup.get('onChain').value) {
      result.push(RegistrationTypes.OnChain);
    }

    return result;
  }

  private buildEnrolmentFormFields() {
    const values = this.enrolmentForm.value.fields;
    return this.fieldList.map((field, index) => (
      {
        key: field.label,
        value: values[index]
      }
    ));
  }

  private updateEnrolmentForm(formArray: FormArray) {
    this.enrolmentForm.removeControl('fields');
    this.enrolmentForm.registerControl('fields', formArray);
    this.registrationTypesGroup.reset(
      {
        offChain: {value: true, disabled: false},
        onChain: {
          value: false,
          disabled: !this.namespaceRegistrationRoles?.has(RegistrationTypes.OnChain)
        }
      }
    );
    this.cdRef.detectChanges();
  }

  getControl(id: number): FormControl {
    return (this.enrolmentForm?.get('fields') as FormArray)?.controls[id] as FormControl;
  }

  get registrationTypesGroup(): AbstractControl {
    return this.enrolmentForm.get('registrationTypes');
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
      case 'text':
        break;
      case 'number':
        break;
      case 'date':
        if (field.maxDate) {
          field.maxDate = new Date(field.maxDate);
        }
        if (field.minDate) {
          field.minDate = new Date(field.minDate);
        }
        break;
      case 'boolean':
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
