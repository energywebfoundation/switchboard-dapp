import { Component, Input } from '@angular/core';

@Component({
  selector: 'new-app-expiration-info',
  templateUrl: './expiration-info.component.html',
  styleUrls: ['./expiration-info.component.scss'],
})
export class ExpirationInfoComponent {
  @Input() defaultValidityPeriod: number;
  @Input() expirationTime: number;
  @Input() removeExpDate: boolean;
}
