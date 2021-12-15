import { Component, Input } from '@angular/core';

export interface NestedList {
  text: string;
  subList: NestedList[];
}

@Component({
  selector: 'app-nested-list',
  templateUrl: './nested-list.component.html',
  styleUrls: ['./nested-list.component.scss']
})
export class NestedListComponent {
  @Input() list: NestedList[];
}
