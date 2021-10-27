import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DidBookRecord } from '../../services/did-book.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-did-book-list',
  templateUrl: './did-book-list.component.html',
  styleUrls: ['./did-book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidBookListComponent {
  @Input() set list(value: DidBookRecord[]) {
    if (!value) {
      return;
    }

    this.dataSource.data = value;
  };

  @Output() delete = new EventEmitter<string>();
  displayedColumns = ['label', 'actions'];

  dataSource = new MatTableDataSource<DidBookRecord>([]);

  remove(id: string) {
    this.delete.emit(id);
  }
}
