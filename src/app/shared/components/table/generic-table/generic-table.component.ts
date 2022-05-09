import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export enum ColumnType {
  String = 'string',
  Date = 'date',
  Custom = 'custom',
  DID = 'did',
  Actions = 'actions'
}

export interface ColumnDefinition {
  type: ColumnType;
  header: string;
  field: string;
  customElement?: any;
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent implements AfterViewInit {


  @Input() list: unknown[];

  @Input() columDefinitions: ColumnDefinition[]


  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<unknown>([]);

  constructor() {}

  ngAfterViewInit(): void {
      this.displayedColumns = this.columDefinitions.map(item => item.field);
      this.dataSource.data = this.list;
      console.log(this.displayedColumns);
      console.log(this.columDefinitions);
  }
}
