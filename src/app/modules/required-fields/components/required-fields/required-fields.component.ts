import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

const FIELDS_CONTROL = 'fields';

export interface RequiredFields {
  fieldsData(): Record<string, string>;

  isValid(): boolean;
}

@Component({
  selector: 'app-required-fields',
  templateUrl: './required-fields.component.html',
  styleUrls: ['./required-fields.component.scss'],
})
export class RequiredFieldsComponent implements RequiredFields {
  @Input() set fieldList(list) {
    this.fields = list;
    this.generateForm();
  }

  get fieldList() {
    return this.fields;
  }

  form = new FormGroup({
    [FIELDS_CONTROL]: new FormArray([]),
  });
  private fields;

  getFields(): FormArray {
    return this.form.get(FIELDS_CONTROL) as FormArray;
  }

  fieldsData(): Record<string, string> {
    return this.createRecordParams(this.getFields().value, this.fieldList);
  }

  isValid() {
    return this.form.valid;
  }

  generateForm() {
    this.form.removeControl(FIELDS_CONTROL);
    this.form.registerControl(
      FIELDS_CONTROL,
      new FormArray(this.createControls(this.fields))
    );
  }

  getControl(id: number): FormControl {
    return (this.form?.get(FIELDS_CONTROL) as FormArray)?.controls[
      id
    ] as FormControl;
  }

  private createControls(
    params: { name: string; pattern: string; description: string }[]
  ) {
    return params.map((field) => {
      const control = new FormControl();
      control.setValidators(this.buildValidators(field));
      return control;
    });
  }

  buildValidators(field) {
    const validations = [Validators.required];

    if (field.pattern) {
      validations.push(Validators.pattern(field.pattern));
    }

    return validations;
  }

  private createRecordParams(
    values: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[]
  ): Record<string, string> {
    return list.reduce((prev, next, index) => {
      return { ...prev, [next.name]: values[index] };
    }, {});
  }
}
