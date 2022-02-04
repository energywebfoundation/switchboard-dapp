import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-menu-trigger',
  templateUrl: './user-menu-trigger.component.html',
  styleUrls: ['./user-menu-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuTriggerComponent {
  @Input() userName: string;
}
