import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNameComponent {
  @Input() userName: string;
}
