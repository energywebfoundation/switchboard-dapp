import { Component } from '@angular/core';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent {
  terms = [
    {text: 'Minimum Patron commitment (#of months, minimum and maximum)'},
    {text: 'Patron revenue share (% of total EWT earned by Provider)'},
    {text: 'Minimum EWT amount'},
    {text: 'Maximum EWT amount'},
    {
      text: 'Other specific requirements defined by Providers or dSLA',
      subList: [
        {text: 'location of the Patron (“Non-US Resident”) accredited investors only'},
        {text: 'accredited investors only'},
        {text: 'others...'}
      ]
    }
  ];

  constructor() {
  }

  acceptContract() {
  }
}
