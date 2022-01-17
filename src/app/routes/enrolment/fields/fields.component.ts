import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  @Input() title: string;
  @Input() fieldsList: KeyValue<string, string | number>[];
}
