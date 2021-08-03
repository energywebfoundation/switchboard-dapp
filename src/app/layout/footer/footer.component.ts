import { Component } from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public settings: SettingsService) {
  }
}
