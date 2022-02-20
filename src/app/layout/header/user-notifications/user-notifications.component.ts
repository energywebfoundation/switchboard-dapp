import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
})
export class UserNotificationsComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  closeIt() {
    this.trigger.closeMenu();
  }
  @Input() notificationNewItems: number;
  @Input() notificationList;

  @Output() clear = new EventEmitter();
  @Output() closed = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onHiddenNotificationList() {
    this.closed.emit();
  }
  clearHandler() {
    this.clear.emit();
  }
}
