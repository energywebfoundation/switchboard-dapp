import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-issuer-fields',
  templateUrl: './issuer-fields.component.html',
  styleUrls: ['./issuer-fields.component.scss']
})
export class IssuerFieldsComponent {
  @Output() updateData = new EventEmitter();
  @Input() issuerFields: any[];

  showFieldsForm = false;
  fieldIndex: number;
  fieldToEdit = null;

  showAddFieldForm() {
    this.showFieldsForm = true;
  }

  addFieldHandler(fieldData) {
    const data = [...this.issuerFields, fieldData];
    this.updateDataSource(data);
    this.hideForm();
  }

  updateFieldHandler(fieldData) {
    const data = this.issuerFields.map((item, index) => {
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
    this.fieldToEdit = this.issuerFields[i];

    this.showFieldsForm = true;
  }

  deleteField(i: number) {
    const list = this.issuerFields;
    list.splice(i, 1);
    this.updateDataSource([...list]);
  }

  moveUp(i: number) {
    const list = this.issuerFields;
    const tmp = list[i - 1];

    // Switch
    list[i - 1] = list[i];
    list[i] = tmp;

    this.updateDataSource([...list]);
  }

  moveDown(i: number) {
    const list = this.issuerFields;
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

  private hideForm() {
    this.showFieldsForm = false;
  }

}
