import { Component, Input, EventEmitter, ChangeDetectorRef, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

const FIELD_TYPES = [
  'text', 'number', 'date', 'boolean'
];

@Component({
  selector: 'app-role-field',
  templateUrl: './role-field.component.html',
  styleUrls: ['./role-field.component.scss']
})
export class RoleFieldComponent {

  @Input() fieldsForm: FormGroup;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() isChecking: boolean;

  @Output() cleanForm = new EventEmitter<boolean>();
  @Output() updateData = new EventEmitter<MatTableDataSource<any>>();
  @Output() back = new EventEmitter<void>();
  @Output() proceed = new EventEmitter<void>();

  showFieldsForm = false;
  isEditFieldForm = false;
  fieldIndex: number;
  public FieldTypes = FIELD_TYPES;

  constructor() {
  }

  showAddFieldForm() {
    this.resetForm();
    this.showFieldsForm = true;
  }

  addField() {
    if (this.fieldsForm.valid) {
      const data = [...this.dataSource.data, this._extractValidationObject(this.fieldsForm.value)];
      this.updateDataSource(data);
      this.resetForm();
    }
  }

  updateField() {
    if (this.fieldsForm.valid) {
      const data = this.dataSource.data.map((item, index) => {
        if (this.fieldIndex === index) {
          return this._extractValidationObject(this.fieldsForm.value);
        }
        return item;
      });
      this.updateDataSource(data);
      this.resetForm();
    }
  }

  editField(i: number) {
    this.fieldIndex = i;
    const field = this.dataSource.data[i];
    const fieldKeys = Object.keys(field);
    const valueToPatch = {};

    fieldKeys.map(fieldKey => {
      this.fieldsForm.get(fieldKey)?.setValue(field[fieldKey]);
      valueToPatch[fieldKey] = field[fieldKey];
    });

    this.fieldsForm.get('validation').patchValue(valueToPatch);

    this.isEditFieldForm = true;
    this.showFieldsForm = true;
  }

  deleteField(i: number) {
    const list = this.dataSource.data;
    list.splice(i, 1);
    this.updateDataSource([...list]);
  }

  moveUp(i: number) {
    const list = this.dataSource.data;
    const tmp = list[i - 1];

    // Switch
    list[i - 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  moveDown(i: number) {
    const list = this.dataSource.data;
    const tmp = list[i + 1];

    // Switch
    list[i + 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  cancelAddField() {
    this.resetForm();
  }

  updateDataSource(data) {
    this.updateData.emit(data);
  }

  onBack() {
    this.back.emit();
  }

  proceedConfirmDetails() {
    this.proceed.emit();
  }

  private _extractValidationObject(value: any) {
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
      } = value.validation;

      let {
        minDate,
        maxDate
      } = value.validation;

      switch (this.fieldsForm.value.fieldType) {
        case 'text':
          validation = {
            required,
            minLength,
            maxLength,
            pattern
          };
          break;
        case 'number':
          validation = {
            required,
            minValue,
            maxValue
          };
          break;
        case 'date':
          minDate = minDate; // this._getDate(minDate);
          maxDate = maxDate; // this._getDate(maxDate);
          validation = {
            required,
            minDate,
            maxDate
          };
          break;
        case 'boolean':
          validation = {
            required
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

  private resetForm() {
    this.isEditFieldForm = false;
    this.showFieldsForm = false;
    this.cleanForm.emit(true);
  }
}
