import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//
// export enum FilterType {
//   Dropdown = 'dropdown',
//   Input = 'input'
// }

export enum ColumnType {
  String = 'string',
  Date = 'date',
  Custom = 'custom',
  DID = 'did',
  Actions = 'actions',
}

// export interface FilterDefinition<T = any> {
//   type: FilterType;
//   placeholder: string;
//   defaultValue: T;
//   callback: (value: T) => any[];
//   tooltip: string;
// }

export interface ColumnDefinition {
  type: ColumnType;
  field: string;
  header?: string;
  customElement?: any;
  condition?: (element: unknown) => boolean;
}
//TODO: handle filtering data in this component
@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent implements OnInit {
  @Input() set list(data: unknown[]) {
    if (!Array.isArray(data)) {
      return;
    }
    this.dataSource.data = data;
  }

  @Input() set columDefinitions(data: ColumnDefinition[]) {
    if (!Array.isArray(data)) {
      return;
    }
    this.displayedColumns = data.map((item) => item.field);
    this._columDefinitions = data;
  }
  get columDefinitions(): ColumnDefinition[] {
    return this._columDefinitions;
  }
  @Input() sortingFunction: (data, sortHeaderId: string) => string | number;

  columnType = ColumnType;

  private _columDefinitions: ColumnDefinition[];

  displayedColumns: string[];

  dataSource = new MatTableDataSource<unknown>([]);

  ngOnInit() {
    if (this.sortingFunction) {
      this.dataSource.sort;
      this.dataSource.sortingDataAccessor = this.sortingFunction;
    }
  }

  checkCondition(item: ColumnDefinition, element: unknown) {
    if (!item.condition) {
      return true;
    }

    return item.condition(element);
  }
}
