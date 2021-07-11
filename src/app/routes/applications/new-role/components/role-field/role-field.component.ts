import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

const FIELD_TYPES = [
  'text', 'number', 'date', 'boolean'
];

@Component({
  selector: 'app-role-field',
  templateUrl: './role-field.component.html',
  styleUrls: ['./role-field.component.scss']
})
export class RoleFieldComponent implements OnInit {

  @Input() fieldsForm: FormGroup;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() isChecking: Boolean;

  @Output() resetFormEvent: EventEmitter<Boolean> = new EventEmitter();
  @Output() updateDataSourceEvent: EventEmitter<MatTableDataSource<any>> = new EventEmitter();
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() proceedConfirmDetailsEvent: EventEmitter<any> = new EventEmitter();

  showFieldsForm = false;
  isEditFieldForm = false;
  fieldIndex : number;
  public FieldTypes = FIELD_TYPES;

  showAddFieldForm() {
    this.resetForm();
    this.showFieldsForm = true;
  }

  addField() {
    if (this.fieldsForm.valid) {
      const data = [...this.dataSource.data, this._extractValidationObject(this.fieldsForm.value)];
      this.updateDataSource(data);
      this.resetForm();
      this.changeDetectorRef.detectChanges();
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
      this.changeDetectorRef.detectChanges();
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

  private _extractValidationObject(value: any) {
    let retVal: any = value;

    if (value && value.fieldType) {
      let validation = undefined;
      let {
        required,
        minLength,
        maxLength,
        pattern,
        minValue,
        maxValue,
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
          minDate = minDate;// this._getDate(minDate);
          maxDate = maxDate;// this._getDate(maxDate);
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

  updateDataSource(data) {
    this.updateDataSourceEvent.emit(data);
  }

  resetForm() {
    this.isEditFieldForm = false;
    this.showFieldsForm = false;
    this.resetFormEvent.emit(true);
  }

  back() {
    this.backEvent.emit();
  }

  proceedConfirmDetails() {
    this.proceedConfirmDetailsEvent.emit();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit(): void {
  }

}
