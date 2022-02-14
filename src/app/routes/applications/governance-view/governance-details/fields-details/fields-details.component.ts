import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFieldDefinition } from '@energyweb/iam-contracts/dist/src/types/DomainDefinitions';

@Component({
  selector: 'app-fields-details',
  templateUrl: './fields-details.component.html',
  styleUrls: ['./fields-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsDetailsComponent {
  @Input() title: string;
  @Input() data: IFieldDefinition[];
  displayedColumnsView: string[] = [
    'type',
    'label',
    'required',
    'minLength',
    'maxLength',
    'pattern',
    'minValue',
    'maxValue',
    'minDate',
    'maxDate',
  ];
}
