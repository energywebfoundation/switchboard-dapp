import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-issuer-fields-summary',
  templateUrl: './issuer-fields-summary.component.html',
  styleUrls: ['./issuer-fields-summary.component.scss']
})
export class IssuerFieldsSummaryComponent {
  @Input() element;
  defaultValue = '--';
}
