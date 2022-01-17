import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-heading',
  templateUrl: './table-heading.component.html',
  styleUrls: ['./table-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadingComponent {
  @Input() heading: string;
}
