import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html',
  styleUrls: ['./notification-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationHeaderComponent {
  @HostBinding('class') classes = 'pt-1 pb-3 px-3 mt-2 mb-2 border-bottom-1';
  @Input() title: string;
  @Input() showClear = true;

  @Output() clear = new EventEmitter();
}
