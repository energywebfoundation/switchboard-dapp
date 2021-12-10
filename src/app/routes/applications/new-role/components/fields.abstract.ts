import { EventEmitter } from '@angular/core';

export abstract class FieldsAbstract<T> {
  abstract updateData: EventEmitter<T[]>;

  abstract get fields(): T[];

  showFieldsForm = false;
  fieldIndex: number;
  fieldToEdit = null;

  addFieldHandler(fieldData: T) {
    const data = [...this.fields, fieldData];
    this.updateDataSource(data);
    this.hideForm();
  }

  updateFieldHandler(fieldData: T) {
    const data = this.fields.map((item, index) => {
      if (this.fieldIndex === index) {
        return fieldData;
      }
      return item;
    });
    this.updateDataSource(data);
    this.hideForm();
    this.fieldToEdit = null;
  }

  editField(i: number) {
    this.fieldIndex = i;
    this.fieldToEdit = this.fields[i];

    this.showFieldsForm = true;
  }

  deleteField(i: number) {
    const list = this.fields;
    list.splice(i, 1);
    this.updateDataSource([...list]);
  }

  moveUp(i: number) {
    const list = this.fields;
    const tmp = list[i - 1];

    // Switch
    list[i - 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  moveDown(i: number) {
    const list = this.fields;
    const tmp = list[i + 1];

    // Switch
    list[i + 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  updateDataSource(data: T[]) {
    this.updateData.emit(data);
  }

  showAddFieldForm() {
    this.showFieldsForm = true;
  }

  canceledHandler() {
    this.hideForm();
  }

  private hideForm() {
    this.showFieldsForm = false;
  }
}
