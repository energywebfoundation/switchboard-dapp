import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent implements OnInit {
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

  constructor(private dialogRef: MatDialogRef<FinalReviewComponent>) {
  }

  ngOnInit(): void {
  }

  acceptContract() {}
}
