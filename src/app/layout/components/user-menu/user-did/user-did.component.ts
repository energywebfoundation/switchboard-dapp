import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-did',
  templateUrl: './user-did.component.html',
  styleUrls: ['./user-did.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDidComponent {
  @Input() did: string;
}
