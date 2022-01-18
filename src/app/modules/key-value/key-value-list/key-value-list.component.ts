import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyValue } from '../key-value.interface';

@Component({
  selector: 'app-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyValueListComponent implements OnInit {
  @Input() data: KeyValue[];

  @Input() mode: 'edit' | 'display' = 'edit';

  @Output() delete = new EventEmitter<number>();
  displayedColumns: string[];

  ngOnInit() {
    this.determineColumns();
  }

  isEditionMode() {
    return this.mode === 'edit';
  }

  removePair(index: number) {
    this.delete.emit(index);
  }

  determineColumns() {
    const defaultColumns = ['key', 'value'];
    if (this.isEditionMode()) {
      defaultColumns.push('actions');
    }
    this.displayedColumns = defaultColumns;
  }

}
