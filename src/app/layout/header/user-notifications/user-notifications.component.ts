import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { SwitchboardToastr } from '../../../shared/services/switchboard-toastr.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent {
  @Input() notificationNewItems: number;
  @Input() notificationList: SwitchboardToastr[];

  @Output() clear = new EventEmitter();
  @Output() closed = new EventEmitter();

  menuCloseHandler() {
    this.closed.emit();
  }

  clearHandler() {
    this.clear.emit();
  }

  areNewNotifications(): boolean {
    return this.notificationNewItems !== 0;
  }
}
