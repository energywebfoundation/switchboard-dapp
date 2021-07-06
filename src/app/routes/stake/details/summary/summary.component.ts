import { Component, Input } from '@angular/core';

interface SummaryList {
  value: string | number;
  title: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() title: string;
  @Input() list: SummaryList[];

}
