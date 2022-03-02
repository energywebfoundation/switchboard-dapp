import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-notification-trigger',
  templateUrl: './menu-notification-trigger.component.html',
  styleUrls: ['./menu-notification-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuNotificationTriggerComponent {
  @Input() items: number;
  @Input() icon: string;

  hideBadges() {
    return this.items === 0;
  }
}
