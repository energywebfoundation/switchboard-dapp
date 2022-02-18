import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
})
export class UserNotificationsComponent implements OnInit {
  @Input() notificationNewItems: number;
  @Input() notificationList;

  @Output() clear = new EventEmitter();
  @Output() closed = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onHiddenNotificationList() {
    this.closed.emit();
  }
  clearSwitchboardToaster() {
    this.clear.emit();
  }
}
