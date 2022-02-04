import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-element',
  templateUrl: './history-element.component.html',
  styleUrls: ['./history-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryElementComponent {
  @Input() element: { header: string; did: string };
}
