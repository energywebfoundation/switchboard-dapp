import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldsAbstract } from '../fields.abstract';
import { IFieldDefinition } from 'iam-client-lib';

@Component({
  selector: 'app-role-field',
  templateUrl: './role-field.component.html',
  styleUrls: ['./role-field.component.scss'],
})
export class RoleFieldComponent extends FieldsAbstract<IFieldDefinition> {
  @Input() fieldsList: IFieldDefinition[];
  @Output() updateData = new EventEmitter<IFieldDefinition[]>();

  get fields() {
    return this.fieldsList;
  }
}
