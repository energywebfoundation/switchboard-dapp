import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldsAbstract } from '../fields.abstract';

@Component({
  selector: 'app-issuer-fields',
  templateUrl: './issuer-fields.component.html',
  styleUrls: ['./issuer-fields.component.scss']
})
export class IssuerFieldsComponent extends FieldsAbstract<any[]> {
  @Input() issuerFields: any[];
  @Output() updateData = new EventEmitter();

  get fields() {
    return this.issuerFields;
  }

}
