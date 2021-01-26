import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TemplatesComponent {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['organization', 'organizationNamespace', 'actions'];
  expandedElement: PeriodicElement | null;

  constructor(private route: Router,private cd: ChangeDetectorRef) { }
}

export interface PeriodicElement {
  organization: string;
  organizationNamespace: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  }, {
    organization: 'Organization 1',
    organizationNamespace: 'org1.iam.ewc',
    actions: ''
  },
];