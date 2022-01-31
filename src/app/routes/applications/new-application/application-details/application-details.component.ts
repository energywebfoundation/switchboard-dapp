import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
})
export class ApplicationDetailsComponent {
  @Input() namespace: string;
  @Input() data: {
    applicationName: string;
    logoUrl: string;
    websiteUrl: string;
    description: string;
    others: string;
  };
}
