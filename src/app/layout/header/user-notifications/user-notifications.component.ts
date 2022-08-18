import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SwitchboardToastr,
  SwitchboardToastrService,
} from '../../../shared/services/switchboard-toastr.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent {
  notificationNewItems$ = this.toastr.newMessagesAmount();
  notificationList$: Observable<SwitchboardToastr[]> =
    this.toastr.getMessageList();
  areNewNotifications$ = this.toastr.areNewNotifications();

  constructor(private toastr: SwitchboardToastrService) {}

  menuCloseHandler() {
    this.toastr.readAll();
  }

  clearHandler(): void {
    this.toastr.reset();
  }
}
