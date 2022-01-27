import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-transactions-complete',
  templateUrl: './transactions-complete.component.html',
  styleUrls: ['./transactions-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsCompleteComponent {
  @Output() completed = new EventEmitter<void>();
}
