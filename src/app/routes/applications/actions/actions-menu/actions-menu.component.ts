import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-actions-menu',
  templateUrl: './actions-menu.component.html',
  styleUrls: ['./actions-menu.component.scss'],
})
export class ActionsMenuComponent {
  @Input() id: number;
}
