import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { KeyValue } from '../key-value.interface';

@Component({
  selector: 'app-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyValueListComponent {
  @Input() set data(value: KeyValue[]) {
    if (!value) {
      return;
    }

    this.dataSource.data = value;
  };

  @Output() delete = new EventEmitter<number>();
  displayedColumns = ['key', 'value', 'actions'];

  dataSource = new MatTableDataSource<KeyValue>([]);

  removePair(index: number) {
    this.delete.emit(index);
  }

}
