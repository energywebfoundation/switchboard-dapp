import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldsAbstract } from '../fields.abstract';

@Component({
  selector: 'app-role-field',
  templateUrl: './role-field.component.html',
  styleUrls: ['./role-field.component.scss']
})
export class RoleFieldComponent extends FieldsAbstract<any[]> {
  @Input() fieldsList: any[];
  @Output() updateData = new EventEmitter();

  get fields() {
    return this.fieldsList;
  }

}
