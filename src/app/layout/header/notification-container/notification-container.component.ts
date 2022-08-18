import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationContainerComponent {}
