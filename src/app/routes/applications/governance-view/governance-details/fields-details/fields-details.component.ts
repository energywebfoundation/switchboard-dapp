import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fields-details',
  templateUrl: './fields-details.component.html',
  styleUrls: ['./fields-details.component.scss']
})
export class FieldsDetailsComponent {
  @Input() title: string;
  @Input() data: any[];
  displayedColumnsView: string[] = ['type', 'label', 'required', 'minLength', 'maxLength', 'pattern', 'minValue', 'maxValue', 'minDate', 'maxDate'];

}
