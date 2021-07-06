import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  @Input() provider: string;
  @Input() since: string;
  @Input() logo: string;
  @Input() description: string;
  constructor() { }

  ngOnInit(): void {
  }

}
