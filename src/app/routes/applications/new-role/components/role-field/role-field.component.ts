import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-field',
  templateUrl: './role-field.component.html',
  styleUrls: ['./role-field.component.scss']
})
export class RoleFieldComponent {
  @Input() fieldsList: any[];
  @Input() isChecking: boolean;

  @Output() updateData = new EventEmitter<any[]>();

  showFieldsForm = false;
  fieldIndex: number;
  fieldToEdit = null;

  showAddFieldForm() {
    this.hideForm();
    this.showFieldsForm = true;
  }

  addFieldHandler(fieldData) {
    const data = [...this.fieldsList, this._extractValidationObject(fieldData)];
    this.updateDataSource(data);
    this.hideForm();
  }

  updateFieldHandler(fieldData) {
    const data = this.fieldsList.map((item, index) => {
      if (this.fieldIndex === index) {
        return this._extractValidationObject(fieldData);
      }
      return item;
    });
    this.updateDataSource(data);
    this.hideForm();
    this.fieldToEdit = null;
  }

  editField(i: number) {
    this.fieldIndex = i;
    this.fieldToEdit = this.fieldsList[i];

    this.showFieldsForm = true;
  }

  deleteField(i: number) {
    const list = this.fieldsList;
    list.splice(i, 1);
    this.updateDataSource([...list]);
  }

  moveUp(i: number) {
    const list = this.fieldsList;
    const tmp = list[i - 1];

    // Switch
    list[i - 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  moveDown(i: number) {
    const list = this.fieldsList;
    const tmp = list[i + 1];

    // Switch
    list[i + 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  canceledHandler() {
    this.hideForm();
  }

  updateDataSource(data) {
    this.updateData.emit(data);
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

      switch (value.fieldType) {
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

  private hideForm() {
    this.showFieldsForm = false;
  }
}
